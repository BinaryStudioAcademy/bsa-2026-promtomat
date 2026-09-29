import { type Format } from "convict";

import { ConfigFormat, ConfigValidationMessage } from "../enums/enums.js";
import {
	checkIsAbsoluteHttpUrl,
	removeTrailingSlash,
} from "../helpers/helpers.js";

const apiUrlFormat: Format = {
	coerce: removeTrailingSlash,
	name: ConfigFormat.API_URL,
	validate: (value: unknown): void => {
		if (typeof value !== "string" || value === "") {
			throw new Error(ConfigValidationMessage.API_URL_MISSING);
		}

		if (!checkIsAbsoluteHttpUrl(value)) {
			throw new Error(ConfigValidationMessage.API_URL_INVALID);
		}
	},
};

export { apiUrlFormat };
