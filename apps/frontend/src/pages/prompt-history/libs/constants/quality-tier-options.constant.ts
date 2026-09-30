import { type SelectOption } from "~/libs/components/select/libs/types/types.js";
import { PromptQualityTier } from "~/modules/prompts/libs/enums/enums.js";

import { PromptHistoryLabel } from "../enums/enums.js";

const QUALITY_TIER_OPTIONS: SelectOption[] = [
	{
		label: PromptHistoryLabel.QUALITY_TIER_ALL,
		value: PromptQualityTier.ALL,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_PROVEN,
		value: PromptQualityTier.PROVEN,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_USABLE,
		value: PromptQualityTier.USABLE,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_NEEDS_IMPROVEMENT,
		value: PromptQualityTier.NEEDS_IMPROVEMENT,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_UNRATED,
		value: PromptQualityTier.UNRATED,
	},
];

export { QUALITY_TIER_OPTIONS };
