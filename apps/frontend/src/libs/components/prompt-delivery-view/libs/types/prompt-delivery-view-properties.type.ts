import { type PromptDeliveryFeedback } from "./prompt-delivery-feedback.type.js";
import { type PromptDeliverySource } from "./prompt-delivery-source.type.js";

type PromptDeliveryViewProperties = {
	body: string;
	efficiencyScore?: number;
	explanation?: string;
	feedback?: PromptDeliveryFeedback;
	isBodyHeaderHidden?: boolean;
	sources?: PromptDeliverySource[];
	workspaceName?: string;
};

export { type PromptDeliveryViewProperties };
