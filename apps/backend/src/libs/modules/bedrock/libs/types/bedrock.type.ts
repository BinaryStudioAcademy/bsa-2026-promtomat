import { type CommandOutput } from "./command-output.type.js";
import { type StructuredGenerationOptions } from "./structured-generation-options.type.js";
import { type TextGenerationOptions } from "./text-generation-options.type.js";

type BedrockInterface = {
	sendCommand(
		options: StructuredGenerationOptions | TextGenerationOptions,
	): Promise<CommandOutput>;
};

export { type BedrockInterface };
