import { SchemaKey } from "../enums/enums.js";
import { type TextStructuredGenerationOutput } from "./text-structured-generation-output.type.js";

type SchemaResultMap = {
	[SchemaKey.TEXT]: TextStructuredGenerationOutput;
};

export { type SchemaResultMap };
