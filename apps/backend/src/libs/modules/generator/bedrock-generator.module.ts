import {
	type BedrockInterface,
	CommandOptions,
	TextGenerationError,
} from "~/libs/modules/bedrock/bedrock.js";

import { TOKENS_THRESHOLD } from "./libs/constants/constants.js";
import { checkIsOutputValid, getOutputSchema } from "./libs/helpers/helpers.js";
import {
	type Generator,
	type SchemaResultMap,
	type StructuredGenerationOptions,
	type TextGenerationOptions,
} from "./libs/types/types.js";

type Constructor = {
	bedrockService: BedrockInterface;
};

class BedrockGenerator implements Generator {
	private bedrockService: BedrockInterface;

	public constructor({ bedrockService }: Constructor) {
		this.bedrockService = bedrockService;
	}

	private createCommandOptions<K extends keyof SchemaResultMap>(
		options: StructuredGenerationOptions<K>,
	): CommandOptions {
		const commandOptions = {
			config: options.config,
			message: options.message,
			schema: getOutputSchema(options.schemaKey),
		} as CommandOptions;

		if (options.systemPrompt !== undefined) {
			commandOptions.systemPrompt = options.systemPrompt;
		}

		return commandOptions;
	}

	private parseOutput(text: string): unknown {
		try {
			return JSON.parse(text);
		} catch (error) {
			throw TextGenerationError.outputUnusable(error);
		}
	}

	private throwIfExceedsTokenLimit(options: TextGenerationOptions) {
		if (options.config.maxTokens > TOKENS_THRESHOLD) {
			throw TextGenerationError.maxTokensExceedsAllowedThreshold(
				TOKENS_THRESHOLD,
			);
		}
	}

	private tryGetContent(text: string | undefined): string {
		if (text === undefined) {
			throw TextGenerationError.outputUnusable();
		}

		return text;
	}

	public async generate<K extends keyof SchemaResultMap>(
		options: StructuredGenerationOptions<K>,
	): Promise<SchemaResultMap[K]> {
		this.throwIfExceedsTokenLimit(options);
		const result = await this.bedrockService.sendCommand(
			this.createCommandOptions(options),
		);

		if (result.isTextTruncated) {
			throw TextGenerationError.outputUnusable();
		}

		const output = this.parseOutput(this.tryGetContent(result.text));

		if (!checkIsOutputValid(options.schemaKey, output)) {
			throw TextGenerationError.outputUnusable();
		}

		return output;
	}

	public async generateText(options: TextGenerationOptions): Promise<string> {
		const result = await this.bedrockService.sendCommand(options);

		this.throwIfExceedsTokenLimit(options);

		if (result.isTextTruncated) {
			throw TextGenerationError.outputUnusable();
		}

		return this.tryGetContent(result.text);
	}
}

export { BedrockGenerator };
