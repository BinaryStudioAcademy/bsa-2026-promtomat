import { type ShellPageCopy } from "../types/types.js";

const checkIsShellPageCopy = (value: unknown): value is ShellPageCopy => {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	if (!("subtitle" in value) || !("title" in value)) {
		return false;
	}

	return typeof value.subtitle === "string" && typeof value.title === "string";
};

export { checkIsShellPageCopy };
