import {
	BedrockRuntimeClient,
	ConverseCommand,
	type ConverseCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

import { type Logger } from "~/libs/modules/logger/logger.js";

import {
	DEFAULT_CONVERSATION_ROLE,
	FIRST_CONTENT_INDEX,
	SCHEMA_FORMAT_TYPE,
} from "./libs/constants/constants.js";
import {
	checkIsTextTruncated,
	convertBedrockErrorToTextGenerationError,
	getBedrockErrorDetails,
} from "./libs/helpers/helpers.js";
import {
	type CommandOptions,
	type CommandOutput,
	type StructuredOutputSchema,
} from "./libs/types/types.js";

type Constructor = {
	connectionTimeoutMs: number;
	logger: Logger;
	maxAttempts: number;
	modelId: string;
	region: string;
	requestTimeoutMs: number;
};

class Bedrock {
	private client: BedrockRuntimeClient;

	private logger: Logger;

	private modelId: string;

	public constructor({
		connectionTimeoutMs,
		logger,
		maxAttempts,
		modelId,
		region,
		requestTimeoutMs,
	}: Constructor) {
		this.client = new BedrockRuntimeClient({
			maxAttempts,
			region,
			requestHandler: {
				connectionTimeout: connectionTimeoutMs,
				requestTimeout: requestTimeoutMs,
				throwOnRequestTimeout: true,
			},
		});
		this.logger = logger;
		this.modelId = modelId;
	}

	private createConverseCommandInput({
		config,
		message,
		schema,
		systemPrompt,
	}: CommandOptions): ConverseCommandInput {
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

		if (schema !== undefined) {
			input.outputConfig = this.createOutputConfig(schema);
		}

		return input;
	}

	private createOutputConfig(
		schema: StructuredOutputSchema,
	): ConverseCommandInput["outputConfig"] {
		return {
			textFormat: {
				structure: {
					jsonSchema: {
						description: schema.description,
						name: schema.name,
						schema: schema.value,
					},
				},
				type: SCHEMA_FORMAT_TYPE,
			},
		};
	}

	public async sendCommand(options: CommandOptions): Promise<CommandOutput> {
		try {
			const result = await this.client.send(
				new ConverseCommand(this.createConverseCommandInput(options)),
			);
			const text =
				result.output?.message?.content?.at(FIRST_CONTENT_INDEX)?.text;
			return {
				isTextTruncated: checkIsTextTruncated(result.stopReason),
				text,
			};
		} catch (error) {
			const textGenerationError =
				convertBedrockErrorToTextGenerationError(error);

			this.logger.error(
				`Bedrock request failed for model "${this.modelId}" — classified as ${textGenerationError.code}.`,
				getBedrockErrorDetails(error),
			);

			throw textGenerationError;
		}
	}
}

export { Bedrock };
