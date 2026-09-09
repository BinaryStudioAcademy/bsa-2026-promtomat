import { SchemaKey } from "../enums/enums.js";
import { LabelStructuredGenerationOutput } from "./label-structured-generation-output.js";
import { type TextStructuredGenerationOutput } from "./text-structured-generation-output.type.js";

type SchemaResultMap = {
	[SchemaKey.LABEL]: LabelStructuredGenerationOutput;
	[SchemaKey.TEXT]: TextStructuredGenerationOutput;
};

export { type SchemaResultMap };
