import { type ValueOf } from "~/libs/types/types.js";

import { type EmbeddingStatus } from "../enums/enums.js";
import { type Embedding } from "./embedding.type.js";

type EmbeddingService = {
	embed(texts: string[]): Promise<Embedding[]>;
	init(): void;
	status: ValueOf<typeof EmbeddingStatus>;
};

export { type EmbeddingService };
