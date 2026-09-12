import { VariantToCanonical } from "../enums/enums.js";
import { normalizeTagName } from "./normalize-tech-stack-tags.helper.js";

const checkIsValidTechStackTag = (tag: string): boolean => {
	return Object.hasOwn(VariantToCanonical, normalizeTagName(tag));
};

export { checkIsValidTechStackTag };
