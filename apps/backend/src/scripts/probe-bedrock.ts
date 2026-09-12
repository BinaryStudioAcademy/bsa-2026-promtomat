import { getErrorDetails } from "~/libs/helpers/helpers.js";
import {
	generator,
	SchemaKey,
	TextGenerationError,
} from "~/libs/modules/generator/generator.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { normalizePromptLabel } from "~/modules/labels/labels.js";
import {
	LABEL_GENERATION_MAX_TOKENS,
	LABEL_GENERATION_TEMPERATURE,
	LABEL_GENERATION_TOP_P,
} from "~/modules/prompts/libs/constants/constants.js";
import { createGenerateLabelMessage } from "~/modules/prompts/libs/helpers/helpers.js";

const PROBE_FAILURE_EXIT_CODE = 1;

// A prompt the model has to categorise, plus a label set it should prefer to
// reuse. "authentication" is deliberately close to "auth": if the model mints a
// near-duplicate instead of reusing, the reuse instruction is not landing.
const PROBE_PROMPT = {
	existingLabels: ["auth", "billing", "search"],
	promptBody:
		"Review this Express route handler and point out any missing input validation on the request body.",
	taskIntent: "Review a route handler for missing validation",
};

const config = {
	maxTokens: LABEL_GENERATION_MAX_TOKENS,
	temperature: LABEL_GENERATION_TEMPERATURE,
	topP: LABEL_GENERATION_TOP_P,
};

const describeFailure = (error: unknown): void => {
	if (error instanceof TextGenerationError) {
		logger.error(
			`Bedrock probe failed with a typed generation error (code ${error.code}).`,
			getErrorDetails(error),
		);

		return;
	}

	logger.error(
		"Bedrock probe failed with an unrecognized error — this is not a generation failure.",
		getErrorDetails(error),
	);
};

// The narrower path: it only needs the model to answer at all, so a failure
// here points at credentials, region or model id rather than at the schema.
const probeText = async (): Promise<void> => {
	const startedAt = performance.now();

	const text = await generator.generateText({
		config,
		message: "Reply with the single word: ready",
	});

	logger.info("Bedrock probe: plain text generation succeeded.", {
		elapsedMs: Math.round(performance.now() - startedAt),
		text,
	});
};

// The path label generation actually uses. Truncation here usually means
// maxTokens is too low for the model's reasoning output, not that it failed.
const probeStructured = async (): Promise<void> => {
	const startedAt = performance.now();

	const result = await generator.generate({
		config,
		message: createGenerateLabelMessage(PROBE_PROMPT),
		schemaKey: SchemaKey.LABEL,
	});

	const normalized = normalizePromptLabel(result.label);

	logger.info("Bedrock probe: structured label generation succeeded.", {
		elapsedMs: Math.round(performance.now() - startedAt),
		isReused: PROBE_PROMPT.existingLabels.includes(normalized ?? ""),
		normalized,
		raw: result.label,
	});

	if (normalized === null) {
		logger.warn(
			"Bedrock probe: the label did not survive normalisation, so a real submission would be refused.",
		);
	}
};

try {
	await probeText();
	await probeStructured();

	logger.info("Bedrock probe finished — generation is reachable and usable.");
} catch (error) {
	describeFailure(error);
	process.exitCode = PROBE_FAILURE_EXIT_CODE;
} finally {
	logger.flush();
}
