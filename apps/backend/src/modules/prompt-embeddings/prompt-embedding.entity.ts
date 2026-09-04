import { type Embedding } from "~/libs/modules/embedding/embedding.js";
import { type Entity } from "~/libs/types/types.js";

class PromptEmbeddingEntity implements Entity {
	private createdAt: string;

	private embedding: Embedding;

	private id: null | number;

	private modelId: string;

	private promptId: number;

	private sourceHash: string;

	private updatedAt: string;

	private constructor({
		createdAt,
		embedding,
		id,
		modelId,
		promptId,
		sourceHash,
		updatedAt,
	}: {
		createdAt: string;
		embedding: Embedding;
		id: null | number;
		modelId: string;
		promptId: number;
		sourceHash: string;
		updatedAt: string;
	}) {
		this.id = id;
		this.promptId = promptId;
		this.embedding = embedding;
		this.modelId = modelId;
		this.sourceHash = sourceHash;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public static initialize({
		createdAt,
		embedding,
		id,
		modelId,
		promptId,
		sourceHash,
		updatedAt,
	}: {
		createdAt: string;
		embedding: Embedding;
		id: number;
		modelId: string;
		promptId: number;
		sourceHash: string;
		updatedAt: string;
	}): PromptEmbeddingEntity {
		return new PromptEmbeddingEntity({
			createdAt,
			embedding,
			id,
			modelId,
			promptId,
			sourceHash,
			updatedAt,
		});
	}

	public static initializeNew({
		embedding,
		modelId,
		promptId,
		sourceHash,
	}: {
		embedding: Embedding;
		modelId: string;
		promptId: number;
		sourceHash: string;
	}): PromptEmbeddingEntity {
		return new PromptEmbeddingEntity({
			createdAt: new Date().toISOString(),
			embedding,
			id: null,
			modelId,
			promptId,
			sourceHash,
			updatedAt: new Date().toISOString(),
		});
	}

	public toNewObject(): {
		embedding: Embedding;
		modelId: string;
		promptId: number;
		sourceHash: string;
	} {
		return {
			embedding: this.embedding,
			modelId: this.modelId,
			promptId: this.promptId,
			sourceHash: this.sourceHash,
		};
	}

	public toObject(): {
		createdAt: string;
		embedding: Embedding;
		id: number;
		modelId: string;
		promptId: number;
		sourceHash: string;
		updatedAt: string;
	} {
		return {
			createdAt: this.createdAt,
			embedding: this.embedding,
			id: this.id as number,
			modelId: this.modelId,
			promptId: this.promptId,
			sourceHash: this.sourceHash,
			updatedAt: this.updatedAt,
		};
	}
}

export { PromptEmbeddingEntity };
