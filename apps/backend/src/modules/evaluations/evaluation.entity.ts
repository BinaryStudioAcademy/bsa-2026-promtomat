import { type Entity } from "~/libs/types/types.js";

type Constructor = {
	composedPromptId: null | number;
	createdAt: string;
	id: null | number;
	promptId: null | number;
	score: number;
	updatedAt: string;
	userId: number;
};

class EvaluationEntity implements Entity {
	private composedPromptId: null | number;

	private createdAt: string;

	private id: null | number;

	private promptId: null | number;

	private score: number;

	private updatedAt: string;

	private userId: number;

	private constructor({
		composedPromptId,
		createdAt,
		id,
		promptId,
		score,
		updatedAt,
		userId,
	}: Constructor) {
		this.composedPromptId = composedPromptId;
		this.createdAt = createdAt;
		this.id = id;
		this.promptId = promptId;
		this.score = score;
		this.updatedAt = updatedAt;
		this.userId = userId;
	}

	public static initialize({
		composedPromptId,
		createdAt,
		id,
		promptId,
		score,
		updatedAt,
		userId,
	}: Constructor): EvaluationEntity {
		return new EvaluationEntity({
			composedPromptId,
			createdAt,
			id,
			promptId,
			score,
			updatedAt,
			userId,
		});
	}

	public toNewObject(): {
		composedPromptId: null | number;
		promptId: null | number;
		score: number;
		userId: number;
	} {
		return {
			composedPromptId: this.composedPromptId,
			promptId: this.promptId,
			score: this.score,
			userId: this.userId,
		};
	}

	public toObject(): {
		composedPromptId: null | number;
		createdAt: string;
		id: number;
		promptId: null | number;
		score: number;
		updatedAt: string;
		userId: number;
	} {
		return {
			composedPromptId: this.composedPromptId,
			createdAt: this.createdAt,
			id: this.id as number,
			promptId: this.promptId,
			score: this.score,
			updatedAt: this.updatedAt,
			userId: this.userId,
		};
	}
}

export { EvaluationEntity };
