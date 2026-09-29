import { TRAILING_SLASH_PATTERN } from "../constants/constants.js";

const removeTrailingSlash = (value: string): string =>
	value.replace(TRAILING_SLASH_PATTERN, "");

export { removeTrailingSlash };
