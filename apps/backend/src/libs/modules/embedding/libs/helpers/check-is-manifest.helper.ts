import { type ModelManifest } from "../types/types.js";

const checkIsStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((entry) => typeof entry === "string");

const checkIsManifest = (value: unknown): value is ModelManifest => {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const candidate = value as { files?: unknown; modelId?: unknown };

	return (
		checkIsStringArray(candidate.files) && typeof candidate.modelId === "string"
	);
};

export { checkIsManifest };
