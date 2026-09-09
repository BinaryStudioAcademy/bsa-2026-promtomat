import { SearchValidationRule } from "./search-validation-rule.enum.js";

const SearchValidationMessage = {
	DESCRIPTION_TOO_LONG: `Description must be at most ${String(SearchValidationRule.DESCRIPTION_MAX_LENGTH)} characters`,
	DESCRIPTION_TOO_SHORT: `Description must be at least ${String(SearchValidationRule.DESCRIPTION_MIN_LENGTH)} characters`,
} as const;

export { SearchValidationMessage };
