import { EntityName } from "~/libs/enums/enums.js";
import { requireEntityId } from "~/libs/helpers/helpers.js";
import { Entity } from "~/libs/types/entity.type.js";

class PromptEntity implements Entity {
	private computedScore: null | number;

	private createdAt: string;

	private efficiencyScore: number;

	private id: null | number;

	private labelId: number;

	private promptBody: string;

	private taskIntent: string;

	private updatedAt: string;

	private userId: number;

	private workspaceId: number;

	private constructor({
		computedScore,
		createdAt,
		efficiencyScore,
		id,
		labelId,
		promptBody,
		taskIntent,
		updatedAt,
		userId,
		workspaceId,
	}: {
		computedScore: null | number;
		createdAt: string;
		efficiencyScore: number;
		id: null | number;
		labelId: number;
		promptBody: string;
		taskIntent: string;
		updatedAt: string;
		userId: number;
		workspaceId: number;
	}) {
		this.id = id;
		this.computedScore = computedScore;
		this.efficiencyScore = efficiencyScore;
		this.promptBody = promptBody;
		this.taskIntent = taskIntent;
		this.userId = userId;
		this.workspaceId = workspaceId;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.labelId = labelId;
	}

	public static initialize({
		computedScore,
		createdAt,
		efficiencyScore,
		id,
		labelId,
		promptBody,
		taskIntent,
		updatedAt,
		userId,
		workspaceId,
	}: {
		computedScore: null | number;
		createdAt: string;
		efficiencyScore: number;
		id: number;
		labelId: number;
		promptBody: string;
		taskIntent: string;
		updatedAt: string;
		userId: number;
		workspaceId: number;
	}): PromptEntity {
		return new PromptEntity({
			computedScore,
			createdAt,
			efficiencyScore,
			id,
			labelId,
			promptBody,
			taskIntent,
			updatedAt,
			userId,
			workspaceId,
		});
	}

	public static initializeNew({
		efficiencyScore,
		labelId,
		promptBody,
		taskIntent,
		userId,
		workspaceId,
	}: {
		efficiencyScore: number;
		labelId: number;
		promptBody: string;
		taskIntent: string;
		userId: number;
		workspaceId: number;
	}): PromptEntity {
		return new PromptEntity({
			computedScore: null,
			createdAt: new Date().toISOString(),
			efficiencyScore,
			id: null,
			labelId,
			promptBody,
			taskIntent,
			updatedAt: new Date().toISOString(),
			userId,
			workspaceId,
		});
	}

	public toDto(workspaceName: string): {
		body: string;
		computedScore: null | number;
		createdAt: string;
		id: number;
		intent: string;
		score: number;
		userId: number;
		workspaceId: number;
		workspaceName: string;
	} {
		return {
			body: this.promptBody,
			computedScore: this.computedScore,
			createdAt: this.createdAt,
			id: requireEntityId(this.id, EntityName.PROMPT),
			intent: this.taskIntent,
			score: this.efficiencyScore,
			userId: this.userId,
			workspaceId: this.workspaceId,
			workspaceName,
		};
	}

	public toNewObject(): {
		efficiencyScore: number;
		labelId: number;
		promptBody: string;
		taskIntent: string;
		userId: number;
		workspaceId: number;
	} {
		return {
			efficiencyScore: this.efficiencyScore,
			labelId: this.labelId,
			promptBody: this.promptBody,
			taskIntent: this.taskIntent,
			userId: this.userId,
			workspaceId: this.workspaceId,
		};
	}

	public toObject(): {
		computedScore: null | number;
		createdAt: string;
		efficiencyScore: number;
		id: number;
		labelId: number;
		promptBody: string;
		taskIntent: string;
		updatedAt: string;
		userId: number;
		workspaceId: number;
	} {
		return {
			computedScore: this.computedScore,
			createdAt: this.createdAt,
			efficiencyScore: this.efficiencyScore,
			id: requireEntityId(this.id, EntityName.PROMPT),
			labelId: this.labelId,
			promptBody: this.promptBody,
			taskIntent: this.taskIntent,
			updatedAt: this.updatedAt,
			userId: this.userId,
			workspaceId: this.workspaceId,
		};
	}
}

export { PromptEntity };
