import { type ShellPageCopyValue } from "../enums/enums.js";

const checkIsShellPageCopy = (value: unknown): value is ShellPageCopyValue => {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	if (!("subtitle" in value) || !("title" in value)) {
		return false;
	}

	return typeof value.subtitle === "string" && typeof value.title === "string";
};

export { checkIsShellPageCopy };
