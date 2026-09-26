import { type PromptForkDraft } from "../types/prompt-fork-draft.type.js";

const isPromptForkDraft = (value: unknown): value is PromptForkDraft => {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	if (!("promptBody" in value) || !("taskIntent" in value)) {
		return false;
	}

	return (
		typeof value.promptBody === "string" && typeof value.taskIntent === "string"
	);
};

export { isPromptForkDraft };
