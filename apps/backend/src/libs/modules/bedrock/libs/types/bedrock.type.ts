import { type CommandOptions } from "./command-options.type.js";
import { type CommandOutput } from "./command-output.type.js";

type BedrockInterface = {
	sendCommand(options: CommandOptions): Promise<CommandOutput>;
};

export { type BedrockInterface };
