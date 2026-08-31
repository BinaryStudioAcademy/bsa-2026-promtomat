import { Entity } from "~/libs/types/entity.type.js";

class PromptEntity implements Entity {
	private createdAt: string;

	private efficiencyScore: number;

	private id: null | number;

	private promptBody: string;

	private taskIntent: string;

	private updatedAt: string;

	private userId: number;

	private workspaceId: number;

	private constructor({
		createdAt,
		efficiencyScore,
		id,
		promptBody,
		taskIntent,
		updatedAt,
		userId,
		workspaceId,
	}: {
		createdAt: string;
		efficiencyScore: number;
		id: null | number;
		promptBody: string;
		taskIntent: string;
		updatedAt: string;
		userId: number;
		workspaceId: number;
	}) {
		this.id = id;
		this.efficiencyScore = efficiencyScore;
		this.promptBody = promptBody;
		this.taskIntent = taskIntent;
		this.userId = userId;
		this.workspaceId = workspaceId;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public static initialize({
		createdAt,
		efficiencyScore,
		id,
		promptBody,
		taskIntent,
		updatedAt,
		userId,
		workspaceId,
	}: {
		createdAt: string;
		efficiencyScore: number;
		id: number;
		promptBody: string;
		taskIntent: string;
		updatedAt: string;
		userId: number;
		workspaceId: number;
	}): PromptEntity {
		return new PromptEntity({
			createdAt,
			efficiencyScore,
			id,
			promptBody,
			taskIntent,
			updatedAt,
			userId,
			workspaceId,
		});
	}

	public static initializeNew({
		efficiencyScore,
		promptBody,
		taskIntent,
		userId,
		workspaceId,
	}: {
		efficiencyScore: number;
		promptBody: string;
		taskIntent: string;
		userId: number;
		workspaceId: number;
	}): PromptEntity {
		return new PromptEntity({
			createdAt: new Date().toISOString(),
			efficiencyScore,
			id: null,
			promptBody,
			taskIntent,
			updatedAt: new Date().toISOString(),
			userId,
			workspaceId,
		});
	}

	public toNewObject(): {
		efficiencyScore: number;
		promptBody: string;
		taskIntent: string;
		userId: number;
		workspaceId: number;
	} {
		return {
			efficiencyScore: this.efficiencyScore,
			promptBody: this.promptBody,
			taskIntent: this.taskIntent,
			userId: this.userId,
			workspaceId: this.workspaceId,
		};
	}

	public toObject(): {
		createdAt: string;
		efficiencyScore: number;
		id: number;
		promptBody: string;
		taskIntent: string;
		updatedAt: string;
		userId: number;
		workspaceId: number;
	} {
		return {
			createdAt: this.createdAt,
			efficiencyScore: this.efficiencyScore,
			id: this.id as number,
			promptBody: this.promptBody,
			taskIntent: this.taskIntent,
			updatedAt: this.updatedAt,
			userId: this.userId,
			workspaceId: this.workspaceId,
		};
	}
}

export { PromptEntity };
