import { type Format } from "convict";

import { ConfigFormat, ConfigFormatMessage } from "../enums/enums.js";

const MINIMUM_POSITIVE_INTEGER = 1;

const positiveIntegerFormat: Format = {
	coerce: Number,
	name: ConfigFormat.POSITIVE_INTEGER,
	validate: (value: unknown): void => {
		if (
			typeof value !== "number" ||
			!Number.isSafeInteger(value) ||
			value < MINIMUM_POSITIVE_INTEGER
		) {
			throw new TypeError(ConfigFormatMessage.POSITIVE_INTEGER);
		}
	},
};

export { positiveIntegerFormat };
