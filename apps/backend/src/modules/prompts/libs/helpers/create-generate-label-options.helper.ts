import { SchemaKey } from "~/libs/modules/generator/generator.js";

import {
	LABEL_GENERATION_MAX_TOKENS,
	LABEL_GENERATION_TEMPERATURE,
	LABEL_GENERATION_TOP_P,
} from "../constants/constants.js";
import { createGenerateLabelMessage } from "./create-generate-label-message.helper.js";

const createGenerateLabelOptions = (
	labels: string[],
	promptBody: string,
	taskIntent: string,
) => ({
	config: {
		maxTokens: LABEL_GENERATION_MAX_TOKENS,
		temperature: LABEL_GENERATION_TEMPERATURE,
		topP: LABEL_GENERATION_TOP_P,
	},
	message: createGenerateLabelMessage({
		existingLabels: labels,
		promptBody,
		taskIntent,
	}),
	schemaKey: SchemaKey.LABEL,
});

export { createGenerateLabelOptions };
