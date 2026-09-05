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
	client: BedrockService;
};

class Generator implements GeneratorInterface {
	private client: BedrockService;

	public constructor({ client }: Constructor) {
		this.client = client;
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
		request: StructuredGenerationOptions,
	): Promise<T> {
		const response = await this.client.sendCommand(request);

		if (!isGenerationCompleted(response.stopReason)) {
			throw new GenerationOutputError();
		}

		try {
			return JSON.parse(this.getContent(response)) as T;
		} catch (error) {
			throw new GenerationOutputError(error);
		}
	}

	public async generateText(request: TextGenerationOptions): Promise<string> {
		const response = await this.client.sendCommand(request);

		if (!isGenerationCompleted(response.stopReason)) {
			throw new GenerationOutputError();
		}

		return this.getContent(response);
	}
}

export { Generator };
