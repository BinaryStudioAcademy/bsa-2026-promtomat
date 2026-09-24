import { HEADER_SAFE_TOKEN_PATTERN } from "../constants/constants.js";
import { ConfigValidationMessage } from "../enums/enums.js";

const validateApiToken = (value: unknown): void => {
	if (typeof value !== "string" || value === "") {
		throw new Error(ConfigValidationMessage.API_TOKEN_MISSING);
	}

	if (!HEADER_SAFE_TOKEN_PATTERN.test(value)) {
		throw new Error(ConfigValidationMessage.API_TOKEN_INVALID);
	}
};

export { validateApiToken };
