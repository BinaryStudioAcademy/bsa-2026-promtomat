import {
	type BedrockRuntimeClient,
	ConverseCommand,
	type ConverseCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

import {
	DEFAULT_CONVERSATION_ROLE,
	FIRST_CONTENT_INDEX,
	TEXT_FORMAT_TYPE,
} from "./libs/constants/constants.js";
import {
	checkIsTextTruncated,
	toTextGenerationError,
} from "./libs/helpers/helpers.js";
import {
	type CommandOutput,
	StructuredGenerationOptions,
	TextGenerationOptions,
} from "./libs/types/types.js";

type Constructor = {
	client: BedrockRuntimeClient;
	modelId: string;
};

class Bedrock {
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
					role: DEFAULT_CONVERSATION_ROLE,
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
		options: StructuredGenerationOptions,
	): ConverseCommandInput {
		const { schema } = options;
		const input: ConverseCommandInput = {
			...this.createBaseConverseCommandInput(options),
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
		options: StructuredGenerationOptions | TextGenerationOptions,
	): Promise<CommandOutput> {
		try {
			const command =
				"schema" in options
					? this.createStructuredConverseCommandInput(options)
					: this.createBaseConverseCommandInput(options);

			const result = await this.client.send(new ConverseCommand(command));
			const text =
				result.output?.message?.content?.at(FIRST_CONTENT_INDEX)?.text;
			return {
				isTextTruncated: checkIsTextTruncated(result.stopReason),
				text,
			};
		} catch (error) {
			throw toTextGenerationError(error);
		}
	}
}

export { Bedrock };
