import { type StructuredOutputSchema } from "~/libs/modules/bedrock/bedrock.js";
import { type ValueOf } from "~/libs/types/types.js";

import { SchemaKey } from "../enums/enums.js";
import {
	labelOutputSchema,
	textOutputSchema,
} from "../output-schemas/output-schemas.js";

const schemas = {
	[SchemaKey.LABEL]: labelOutputSchema,
	[SchemaKey.TEXT]: textOutputSchema,
};

const getOutputSchema = (
	key: ValueOf<typeof SchemaKey>,
): StructuredOutputSchema => {
	return schemas[key];
};

export { getOutputSchema };
