import { type Format } from "convict";

import {
	HTTP_PROTOCOL_PATTERN,
	TRAILING_SLASH_PATTERN,
} from "../constants/constants.js";
import { ConfigFormat, ConfigValidationMessage } from "../enums/enums.js";

const checkIsAbsoluteHttpUrl = (value: string): boolean => {
	try {
		return HTTP_PROTOCOL_PATTERN.test(new URL(value).protocol);
	} catch {
		return false;
	}
};

const apiUrlFormat: Format = {
	coerce: (value: string): string => value.replace(TRAILING_SLASH_PATTERN, ""),
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
