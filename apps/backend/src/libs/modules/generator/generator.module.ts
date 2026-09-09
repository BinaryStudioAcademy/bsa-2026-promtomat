import {
	type BedrockInterface,
	BedrockServiceError,
	type CommandOptions,
	type CommandOutput,
} from "~/libs/modules/bedrock/bedrock.js";

import { TOKENS_THRESHOLD } from "./libs/constants/constants.js";
import { TextGenerationError } from "./libs/exceptions/exceptions.js";
import { getOutputSchema } from "./libs/helpers/helpers.js";
import {
	type GeneratorInterface,
	type SchemaResultMap,
	type StructuredGenerationOptions,
	type TextGenerationOptions,
} from "./libs/types/types.js";

type Constructor = {
	bedrockService: BedrockInterface;
};

class Generator implements GeneratorInterface {
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

	private async sendStructuredCommand(
		options: CommandOptions,
	): Promise<CommandOutput> {
		try {
			return await this.bedrockService.sendCommand(options);
		} catch (error) {
			if (error instanceof BedrockServiceError) {
				throw TextGenerationError.unableToGenerateStructure(error);
			}

			throw error;
		}
	}

	private async sendTextCommand(
		options: CommandOptions,
	): Promise<CommandOutput> {
		try {
			return await this.bedrockService.sendCommand(options);
		} catch (error) {
			if (error instanceof BedrockServiceError) {
				throw TextGenerationError.unableToGenerateText(error);
			}

			throw error;
		}
	}

	private throwIfExceedsTokenLimit(options: TextGenerationOptions): void {
		if (options.config.maxTokens > TOKENS_THRESHOLD) {
			throw TextGenerationError.maxTokensExceedsAllowedThreshold(
				TOKENS_THRESHOLD,
			);
		}
	}

	public async generate<K extends keyof SchemaResultMap>(
		options: StructuredGenerationOptions<K>,
	): Promise<SchemaResultMap[K]> {
		this.throwIfExceedsTokenLimit(options);

		const result = await this.sendStructuredCommand(
			this.createCommandOptions(options),
		);

		if (result.isTextTruncated || result.text === undefined) {
			throw TextGenerationError.unableToGenerateStructure();
		}

		try {
			return JSON.parse(result.text) as SchemaResultMap[K];
		} catch (error) {
			throw TextGenerationError.unableToGenerateStructure(error);
		}
	}

	public async generateText(options: TextGenerationOptions): Promise<string> {
		this.throwIfExceedsTokenLimit(options);

		const result = await this.sendTextCommand(options);

		if (result.isTextTruncated || result.text === undefined) {
			throw TextGenerationError.unableToGenerateText();
		}

		return result.text;
	}
}

export { Generator };
