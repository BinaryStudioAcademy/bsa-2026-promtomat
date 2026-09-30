import { type Format } from "convict";

import { ConfigFormat, ConfigValidationMessage } from "../enums/enums.js";
import {
	checkIsAbsoluteHttpUrl,
	removeTrailingSlash,
} from "../helpers/helpers.js";

const webUrlFormat: Format = {
	coerce: removeTrailingSlash,
	name: ConfigFormat.WEB_URL,
	validate: (value: unknown): void => {
		if (value === "") {
			return;
		}

		if (typeof value !== "string" || !checkIsAbsoluteHttpUrl(value)) {
			throw new Error(ConfigValidationMessage.WEB_URL_INVALID);
		}
	},
};

export { webUrlFormat };
