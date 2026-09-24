import { SchemaKey } from "../enums/enums.js";
import { type ComposedPromptStructuredGenerationOutput } from "./composed-prompt-structured-generation-output.type.js";
import { LabelStructuredGenerationOutput } from "./label-structured-generation-output.type.js";
import { type TextStructuredGenerationOutput } from "./text-structured-generation-output.type.js";

type SchemaResultMap = {
	[SchemaKey.COMPOSED_PROMPT]: ComposedPromptStructuredGenerationOutput;
	[SchemaKey.LABEL]: LabelStructuredGenerationOutput;
	[SchemaKey.TEXT]: TextStructuredGenerationOutput;
};

export { type SchemaResultMap };
