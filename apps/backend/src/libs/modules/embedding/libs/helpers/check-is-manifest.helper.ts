import { type ModelManifest } from "../types/types.js";

const checkIsStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((entry) => typeof entry === "string");

const checkIsManifest = (value: unknown): value is ModelManifest =>
	typeof value === "object" &&
	value !== null &&
	"files" in value &&
	"modelId" in value &&
	checkIsStringArray(value.files) &&
	typeof value.modelId === "string";

export { checkIsManifest };
