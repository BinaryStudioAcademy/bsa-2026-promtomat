import { WHITESPACE_RUN_PATTERN } from "../constants/constants.js";

const normalizeDescription = (description: string): string =>
	description.trim().replaceAll(WHITESPACE_RUN_PATTERN, " ").toLowerCase();

export { normalizeDescription };
