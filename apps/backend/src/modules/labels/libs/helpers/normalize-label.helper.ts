import { LabelConstraint } from "../enums/enums.js";

const normalizePromptLabel = (value: string): null | string => {
	const normalized = value.trim().toLowerCase();

	return LabelConstraint.NAME_PATTERN.test(normalized) ? normalized : null;
};

export { normalizePromptLabel };
