import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";

import {
	TRAILING_HIGH_SURROGATE_PATTERN,
	TRUNCATION_MARKER,
} from "../constants/constants.js";

const truncateSourceBody = (body: string, maxLength: number): string => {
	if (body.length <= maxLength) {
		return body;
	}

	const cut = body
		.slice(FIRST_ELEMENT_INDEX, maxLength)
		.replace(TRAILING_HIGH_SURROGATE_PATTERN, "");

	return `${cut}\n${TRUNCATION_MARKER}`;
};

export { truncateSourceBody };
