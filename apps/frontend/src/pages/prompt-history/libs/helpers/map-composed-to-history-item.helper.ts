import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { type ComposedPromptDto } from "~/modules/composed-prompts/libs/types/types.js";

import { type PromptHistoryItem } from "../types/types.js";

const mapComposedToHistoryItem = (
	composed: ComposedPromptDto,
	workspaceName: string,
): PromptHistoryItem => ({
	body: composed.body,
	computedScore: composed.computedScore,
	createdAt: composed.createdAt,
	id: composed.id,
	intent: composed.description,
	isComposed: true,
	score: ZERO_VALUE,
	uniqueKey: `composed-${String(composed.id)}`,
	userId: ZERO_VALUE,
	workspaceId: composed.workspaceId,
	workspaceName,
});

export { mapComposedToHistoryItem };
