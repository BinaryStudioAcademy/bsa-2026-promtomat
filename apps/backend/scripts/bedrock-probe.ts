import { TextGenerationError } from "~/libs/modules/bedrock/bedrock.js";
import { generator, SchemaKey } from "~/libs/modules/generator/generator.js";
import { logger } from "~/libs/modules/logger/logger.js";

// A short, deterministic request keeps the probe cheap and its output easy to
// eyeball. Temperature is pinned so a rerun that differs means something real
// changed rather than the model sampling differently.
const MAX_TOKENS = 64;
const TEMPERATURE = 0;

const describeFailure = (error: unknown): string => {
	if (error instanceof TextGenerationError) {
		return `code=${error.code} message=${error.message} cause=${String(error.cause)}`;
	}

	return `unrecognized failure: ${String(error)}`;
};

// Plain text generation. This is the narrower path: it only needs the model to
// answer at all, so it is the one to trust when telling a credentials or model
// access problem apart from a structured-output limitation.
const runTextProbe = async (): Promise<void> => {
	try {
		const text = await generator.generateText({
			config: { maxTokens: MAX_TOKENS, temperature: TEMPERATURE, topP: 1 },
			message: "Reply with exactly: bedrock ok",
		});

		logger.info(`[probe] generateText succeeded: ${text}`);
	} catch (error) {
		logger.error(`[probe] generateText failed: ${describeFailure(error)}`);
	}
};

// Structured generation. Uses the Converse structured-output feature, which is
// supported by fewer models than plain text, so this failing while the text
// probe succeeds points at the model rather than at the module.
const runStructuredProbe = async (): Promise<void> => {
	try {
		const answer = await generator.generate({
			config: { maxTokens: MAX_TOKENS, temperature: TEMPERATURE, topP: 1 },
			message: "Answer with JSON matching the schema.",
			schemaKey: SchemaKey.TEXT,
		});

		logger.info(`[probe] generate succeeded: ${JSON.stringify(answer)}`);
	} catch (error) {
		logger.error(`[probe] generate failed: ${describeFailure(error)}`);
	}
};

await runTextProbe();
await runStructuredProbe();
