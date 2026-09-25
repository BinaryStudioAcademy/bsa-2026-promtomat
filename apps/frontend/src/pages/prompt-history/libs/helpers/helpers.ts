import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { type ComposedPromptDto } from "~/modules/composed-prompts/libs/types/types.js";
import { PromptQualityTier } from "~/modules/prompts/libs/enums/enums.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

import { type PromptHistoryItem } from "../types/types.js";

const mapPromptToHistoryItem = (
	prompt: PromptItemResponseDto,
): PromptHistoryItem => ({
	...prompt,
	isComposed: false,
	uniqueKey: `training-${String(prompt.id)}`,
});

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

const checkMatchesQualityTier = (
	computedScore: null | number,
	qualityTier?: string,
): boolean => {
	if (!qualityTier || qualityTier === PromptQualityTier.ALL) {
		return true;
	}

	if (qualityTier === PromptQualityTier.UNRATED) {
		return computedScore === null;
	}

	return computedScore !== null;
};

const checkMatchesSearch = (text: string, searchQuery: string): boolean => {
	if (!searchQuery) {
		return true;
	}

	return text.toLowerCase().includes(searchQuery.toLowerCase());
};

export {
	checkMatchesQualityTier,
	checkMatchesSearch,
	mapComposedToHistoryItem,
	mapPromptToHistoryItem,
};
