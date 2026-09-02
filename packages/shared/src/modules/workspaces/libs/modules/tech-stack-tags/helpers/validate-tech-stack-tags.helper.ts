import { VARIANT_TO_CANONICAL } from "../enums/enums.js";
import { normalizeTagName } from "./normalize-tech-stack-tags.helper.js";

const checkIsValidTechStackTag = (tag: string): boolean => {
	return Object.hasOwn(VARIANT_TO_CANONICAL, normalizeTagName(tag));
};

export { checkIsValidTechStackTag };
