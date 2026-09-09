import { type Embedding } from "~/libs/modules/embedding/embedding.js";

const serializeEmbedding = (embedding: Embedding): string =>
	`[${embedding.join(",")}]`;

export { serializeEmbedding };
