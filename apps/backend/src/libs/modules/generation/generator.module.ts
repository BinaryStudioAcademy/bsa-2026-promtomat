import {
	type BedrockInterface,
	type StructuredGenerationOptions,
	TextGenerationError,
	type TextGenerationOptions,
} from "~/libs/modules/bedrock/bedrock.js";

import { type GeneratorInterface } from "./libs/types/types.js";

type Constructor = {
	bedrockService: BedrockInterface;
};

class Generator implements GeneratorInterface {
	private bedrockService: BedrockInterface;

	public constructor({ bedrockService }: Constructor) {
		this.bedrockService = bedrockService;
	}

	private tryGetContent(text: string | undefined): string {
		if (text === undefined) {
			throw TextGenerationError.outputUnusable();
		}

		return text;
	}

	public async generate<T extends object>(
		options: StructuredGenerationOptions,
	): Promise<T> {
		const result = await this.bedrockService.sendCommand(options);

		if (result.isTextTruncated) {
			throw TextGenerationError.outputUnusable();
		}

		const text = this.tryGetContent(result.text);
		try {
			return JSON.parse(text) as T;
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
