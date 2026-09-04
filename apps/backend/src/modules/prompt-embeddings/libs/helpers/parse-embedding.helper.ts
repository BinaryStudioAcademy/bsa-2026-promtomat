import { type Embedding } from "~/libs/modules/embedding/embedding.js";

import { checkIsEmbedding } from "./check-is-embedding.helper.js";

const parseEmbedding = (literal: string): Embedding | null => {
	const parsed: unknown = JSON.parse(literal);

	return checkIsEmbedding(parsed) ? parsed : null;
};

export { parseEmbedding };
