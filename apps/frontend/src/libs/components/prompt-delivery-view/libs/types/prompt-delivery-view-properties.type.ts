import { type Control } from "react-hook-form";

import { type PromptUpdateBodyRequestDto } from "~/modules/prompts/libs/types/types.js";

import { type PromptDeliverySource } from "./prompt-delivery-source.type.js";

type PromptDeliveryRevision = {
	bodyControl: Control<PromptUpdateBodyRequestDto, null>;
	isEditingBody: boolean;
	isOwner: boolean;
	isSavingBody: boolean;
	isSavingScore: boolean;
	onCancelBodyEdit: () => void;
	onFork: () => void;
	onSaveBody: () => void;
	onScoreSelect: (score: number) => () => void;
	onStartBodyEdit: () => void;
	selectedScore: null | number;
};

type PromptDeliveryViewProperties = {
	body: string;
	computedScore: null | number;
	efficiencyScore?: null | number;
	explanation?: string;
	isLoading?: boolean | undefined;
	onScoreSelect?: (score: number) => void;
	revision?: PromptDeliveryRevision;
	sources?: PromptDeliverySource[];
	workspaceName?: string;
};

export { type PromptDeliveryViewProperties };
