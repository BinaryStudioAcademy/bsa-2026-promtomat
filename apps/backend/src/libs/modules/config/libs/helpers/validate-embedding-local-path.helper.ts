import path from "node:path";

import { checkIsUnsafeDeletePath } from "~/libs/helpers/helpers.js";

const validateEmbeddingLocalPath = (value: unknown): void => {
	if (typeof value !== "string" || value.trim() === "") {
		throw new TypeError("EMBEDDING_LOCAL_PATH must be a non-empty string.");
	}

	if (checkIsUnsafeDeletePath(value)) {
		throw new Error(
			`EMBEDDING_LOCAL_PATH must be a dedicated directory — "${path.resolve(value)}" is the filesystem root, the home directory, the working directory, or one of its ancestors.`,
		);
	}
};

export { validateEmbeddingLocalPath };
