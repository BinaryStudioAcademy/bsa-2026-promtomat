import { LABEL_NAME_PATTERN } from "../constants/constants.js";

const normalizeLabel = (value: string): null | string => {
	const normalized = value.trim().toLowerCase();

	return LABEL_NAME_PATTERN.test(normalized) ? normalized : null;
};

export { normalizeLabel };
