import {
	type BedrockInterface,
	CommandOptions,
	TextGenerationError,
} from "~/libs/modules/bedrock/bedrock.js";

import { TOKENS_THRESHOLD } from "./libs/constants/constants.js";
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
		if (options.config.maxTokens > TOKENS_THRESHOLD) {
			throw TextGenerationError.maxTokensExceedsAllowedThreshold(
				TOKENS_THRESHOLD,
			);
		}

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

	private tryGetContent(text: string | undefined): string {
		if (text === undefined) {
			throw TextGenerationError.outputUnusable();
		}

		return text;
	}

	public async generate<K extends keyof SchemaResultMap>(
		options: StructuredGenerationOptions<K>,
	): Promise<SchemaResultMap[K]> {
		const result = await this.bedrockService.sendCommand(
			this.createCommandOptions(options),
		);

		if (result.isTextTruncated) {
			throw TextGenerationError.outputUnusable();
		}

		const text = this.tryGetContent(result.text);

		try {
			return JSON.parse(text) as SchemaResultMap[K];
		} catch (error) {
			throw TextGenerationError.outputUnusable(error);
		}
	}

	public async generateText(options: TextGenerationOptions): Promise<string> {
		const result = await this.bedrockService.sendCommand(options);

		if (result.isTextTruncated) {
			throw TextGenerationError.outputUnusable();
		}

		return this.tryGetContent(result.text);
	}
}

export { Generator };
