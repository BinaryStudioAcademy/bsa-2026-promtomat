import {
	type BedrockInterface,
	type StructuredGenerationOptions,
	type TextGenerationOptions,
} from "~/libs/modules/bedrock/bedrock.js";

import { GenerationError } from "./libs/exceptions/exceptions.js";
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
			throw GenerationError.outputUnusable();
		}

		return text;
	}

	public async generate<T extends object>(
		options: StructuredGenerationOptions,
	): Promise<T> {
		const result = await this.bedrockService.sendCommand(options);

		if (result.isTextTruncated) {
			throw GenerationError.outputUnusable();
		}

		const text = this.tryGetContent(result.text);
		try {
			return JSON.parse(text) as T;
		} catch (error) {
			throw GenerationError.outputUnusable(error);
		}
	}

	public async generateText(options: TextGenerationOptions): Promise<string> {
		const result = await this.bedrockService.sendCommand(options);

		if (result.isTextTruncated) {
			throw GenerationError.outputUnusable();
		}

		return this.tryGetContent(result.text);
	}
}

export { Generator };
