import {
	type BedrockRuntimeClient,
	ConverseCommand,
	type ConverseCommandInput,
	type ConverseCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

import { DEFAULT_ROLE, TEXT_FORMAT_TYPE } from "../constants/constants.js";
import { toApplicationError } from "../helpers/helpers.js";
import {
	type StructuredGenerationOptions,
	type TextGenerationOptions,
} from "../types/types.js";

type Constructor = {
	client: BedrockRuntimeClient;
	modelId: string;
};

class BedrockService {
	private client: BedrockRuntimeClient;

	private modelId: string;

	public constructor({ client, modelId }: Constructor) {
		this.client = client;
		this.modelId = modelId;
	}

	private createBaseConverseCommandInput({
		config,
		message,
		systemPrompt,
	}: TextGenerationOptions): ConverseCommandInput {
		const input: ConverseCommandInput = {
			inferenceConfig: {
				maxTokens: config?.maxTokens,
				stopSequences: config?.stopSequences,
				temperature: config?.temperature,
				topP: config?.topP,
			},
			messages: [
				{
					content: [{ text: message }],
					role: DEFAULT_ROLE,
				},
			],
			modelId: this.modelId,
		};

		if (systemPrompt !== undefined) {
			input.system = [{ text: systemPrompt }];
		}

		return input;
	}

	private createStructuredConverseCommandInput(
		request: StructuredGenerationOptions,
	): ConverseCommandInput {
		const { schema } = request;
		const input: ConverseCommandInput = {
			...this.createBaseConverseCommandInput(request),
			outputConfig: {
				textFormat: {
					structure: {
						jsonSchema: {
							description: schema.description,
							name: schema.name,
							schema: schema.value,
						},
					},
					type: TEXT_FORMAT_TYPE,
				},
			},
		};

		return input;
	}

	public async sendCommand(
		request: StructuredGenerationOptions | TextGenerationOptions,
	): Promise<ConverseCommandOutput> {
		try {
			const command =
				"schema" in request
					? this.createStructuredConverseCommandInput(request)
					: this.createBaseConverseCommandInput(request);

			return await this.client.send(new ConverseCommand(command));
		} catch (error) {
			throw toApplicationError(error);
		}
	}
}

export { BedrockService };
