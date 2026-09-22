import { type Entity } from "~/libs/types/types.js";

import {
	type ComposedPromptNewSource,
	type ComposedPromptSourceDto,
} from "./libs/types/types.js";

class ComposedPromptEntity implements Entity {
	private body: string;

	private computedScore: null | number;

	private createdAt: string;

	private description: string;

	private descriptionHash: string;

	private explanation: string;

	private id: null | number;

	private modelId: string;

	private requesterId: number;

	private sources: ComposedPromptSourceDto[];

	private updatedAt: string;

	private workspaceId: number;

	private constructor({
		body,
		computedScore,
		createdAt,
		description,
		descriptionHash,
		explanation,
		id,
		modelId,
		requesterId,
		sources,
		updatedAt,
		workspaceId,
	}: {
		body: string;
		computedScore: null | number;
		createdAt: string;
		description: string;
		descriptionHash: string;
		explanation: string;
		id: null | number;
		modelId: string;
		requesterId: number;
		sources: ComposedPromptSourceDto[];
		updatedAt: string;
		workspaceId: number;
	}) {
		this.id = id;
		this.workspaceId = workspaceId;
		this.requesterId = requesterId;
		this.description = description;
		this.descriptionHash = descriptionHash;
		this.body = body;
		this.explanation = explanation;
		this.modelId = modelId;
		this.sources = sources;
		this.computedScore = computedScore;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public static initialize({
		body,
		computedScore,
		createdAt,
		description,
		descriptionHash,
		explanation,
		id,
		modelId,
		requesterId,
		sources,
		updatedAt,
		workspaceId,
	}: {
		body: string;
		computedScore: null | number;
		createdAt: string;
		description: string;
		descriptionHash: string;
		explanation: string;
		id: number;
		modelId: string;
		requesterId: number;
		sources: ComposedPromptSourceDto[];
		updatedAt: string;
		workspaceId: number;
	}): ComposedPromptEntity {
		return new ComposedPromptEntity({
			body,
			computedScore,
			createdAt,
			description,
			descriptionHash,
			explanation,
			id,
			modelId,
			requesterId,
			sources,
			updatedAt,
			workspaceId,
		});
	}

	public static initializeNew({
		body,
		computedScore = null,
		description,
		descriptionHash,
		explanation,
		modelId,
		requesterId,
		sources,
		workspaceId,
	}: {
		body: string;
		computedScore?: null | number;
		description: string;
		descriptionHash: string;
		explanation: string;
		modelId: string;
		requesterId: number;
		sources: ComposedPromptSourceDto[];
		workspaceId: number;
	}): ComposedPromptEntity {
		return new ComposedPromptEntity({
			body,
			computedScore,
			createdAt: new Date().toISOString(),
			description,
			descriptionHash,
			explanation,
			id: null,
			modelId,
			requesterId,
			sources,
			updatedAt: new Date().toISOString(),
			workspaceId,
		});
	}

	public toNewObject(): {
		body: string;
		computedScore: null | number;
		description: string;
		descriptionHash: string;
		explanation: string;
		modelId: string;
		requesterId: number;
		sources: ComposedPromptNewSource[];
		workspaceId: number;
	} {
		return {
			body: this.body,
			computedScore: this.computedScore,
			description: this.description,
			descriptionHash: this.descriptionHash,
			explanation: this.explanation,
			modelId: this.modelId,
			requesterId: this.requesterId,
			sources: this.sources.map(({ promptId, rank }) => ({ promptId, rank })),
			workspaceId: this.workspaceId,
		};
	}

	public toObject(): {
		body: string;
		computedScore: null | number;
		createdAt: string;
		description: string;
		descriptionHash: string;
		explanation: string;
		id: number;
		modelId: string;
		requesterId: number;
		sources: ComposedPromptSourceDto[];
		updatedAt: string;
		workspaceId: number;
	} {
		return {
			body: this.body,
			computedScore: this.computedScore,
			createdAt: this.createdAt,
			description: this.description,
			descriptionHash: this.descriptionHash,
			explanation: this.explanation,
			id: this.id as number,
			modelId: this.modelId,
			requesterId: this.requesterId,
			sources: this.sources.map((source) => ({ ...source })),
			updatedAt: this.updatedAt,
			workspaceId: this.workspaceId,
		};
	}
}

export { ComposedPromptEntity };
