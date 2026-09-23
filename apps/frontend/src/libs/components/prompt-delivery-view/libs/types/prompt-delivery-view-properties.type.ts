import { type PromptDeliverySource } from "./prompt-delivery-source.type.js";

type PromptDeliveryViewProperties = {
	body: string;
	computedScore: null | number;
	efficiencyScore?: number;
	explanation?: string;
	onScoreSelect?: (score: number) => void;
	sources?: PromptDeliverySource[];
	workspaceName?: string;
};

export { type PromptDeliveryViewProperties };
