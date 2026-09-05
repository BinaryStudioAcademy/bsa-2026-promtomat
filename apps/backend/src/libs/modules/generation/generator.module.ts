import { type ConverseCommandOutput } from "@aws-sdk/client-bedrock-runtime";

import { FIRST_CONTENT_INDEX } from "./libs/constants/constants.js";
import { GenerationErrorMessage } from "./libs/enums/enums.js";
import {
	GenerationError,
	GenerationOutputError,
} from "./libs/exceptions/exceptions.js";
import { isGenerationCompleted } from "./libs/helpers/helpers.js";
import { BedrockService } from "./libs/services/services.js";
import {
	type GeneratorInterface,
	type StructuredGenerationOptions,
	type TextGenerationOptions,
} from "./libs/types/types.js";

type Constructor = {
	bedrockService: BedrockService;
};

class Generator implements GeneratorInterface {
	private bedrockService: BedrockService;

	public constructor({ bedrockService }: Constructor) {
		this.bedrockService = bedrockService;
	}

	private getContent(response: ConverseCommandOutput): string {
		const text =
			response.output?.message?.content?.at(FIRST_CONTENT_INDEX)?.text;

		if (text === undefined) {
			throw new GenerationError(GenerationErrorMessage.OUTPUT_UNUSABLE);
		}

		return text;
	}

	public async generate<T extends object>(
		options: StructuredGenerationOptions,
	): Promise<T> {
		const response = await this.bedrockService.sendCommand(options);

		if (!isGenerationCompleted(response.stopReason)) {
			throw new GenerationOutputError();
		}

		try {
			return JSON.parse(this.getContent(response)) as T;
		} catch (error) {
			throw new GenerationOutputError(error);
		}
	}

	public async generateText(options: TextGenerationOptions): Promise<string> {
		const response = await this.bedrockService.sendCommand(options);

		if (!isGenerationCompleted(response.stopReason)) {
			throw new GenerationOutputError();
		}

		return this.getContent(response);
	}
}

export { Generator };
