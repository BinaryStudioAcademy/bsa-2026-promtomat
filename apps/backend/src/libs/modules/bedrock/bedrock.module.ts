import {
	BedrockRuntimeClient,
	ConverseCommand,
	type ConverseCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

import { config } from "~/libs/modules/config/config.js";

import {
	DEFAULT_CONVERSATION_ROLE,
	FIRST_CONTENT_INDEX,
	TEXT_FORMAT_TYPE,
} from "./libs/constants/constants.js";
import {
	checkIsTextTruncated,
	convertBedrockErrortoTextGenerationError,
} from "./libs/helpers/helpers.js";
import {
	type CommandOutput,
	StructuredGenerationOptions,
	TextGenerationOptions,
} from "./libs/types/types.js";

class Bedrock {
	private client: BedrockRuntimeClient;

	private modelId: string;

	public constructor() {
		this.client = new BedrockRuntimeClient({
			region: config.ENV.AWS.REGION,
		});
		this.modelId = config.ENV.BEDROCK.MODEL.ID;
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
			throw convertBedrockErrortoTextGenerationError(error);
		}
	}
}

export { Bedrock };
