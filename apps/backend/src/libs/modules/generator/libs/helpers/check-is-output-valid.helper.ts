import { SchemaKey } from "../enums/enums.js";
import { type OutputGuardMap, type SchemaResultMap } from "../types/types.js";
import { checkIsComposedPromptOutput } from "./check-is-composed-prompt-output.helper.js";
import { checkIsLabelOutput } from "./check-is-label-output.helper.js";
import { checkIsTextOutput } from "./check-is-text-output.helper.js";

const guards: OutputGuardMap = {
	[SchemaKey.COMPOSED_PROMPT]: checkIsComposedPromptOutput,
	[SchemaKey.LABEL]: checkIsLabelOutput,
	[SchemaKey.TEXT]: checkIsTextOutput,
};

const checkIsOutputValid = <K extends keyof SchemaResultMap>(
	key: K,
	output: unknown,
): output is SchemaResultMap[K] => guards[key](output);

export { checkIsOutputValid };
