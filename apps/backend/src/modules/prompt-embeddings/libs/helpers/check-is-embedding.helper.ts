import { type Embedding } from "~/libs/modules/embedding/embedding.js";

const checkIsEmbedding = (value: unknown): value is Embedding =>
	Array.isArray(value) && value.every((entry) => typeof entry === "number");

export { checkIsEmbedding };
