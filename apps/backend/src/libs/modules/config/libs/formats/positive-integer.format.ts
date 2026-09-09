import { type Format } from "convict";

import { ConfigFormat } from "../enums/enums.js";

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
			throw new TypeError("must be a positive integer");
		}
	},
};

export { positiveIntegerFormat };
