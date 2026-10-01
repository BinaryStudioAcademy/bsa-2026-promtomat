import { type SelectOption } from "~/libs/components/select/libs/types/types.js";
import { PromptHistoryScoreTier } from "~/modules/prompt-history/libs/enums/enums.js";

import { PromptHistoryLabel } from "../enums/enums.js";

const QUALITY_TIER_OPTIONS: SelectOption[] = [
	{
		label: PromptHistoryLabel.QUALITY_TIER_ALL,
		value: PromptHistoryScoreTier.ALL,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_HIGH,
		value: PromptHistoryScoreTier.HIGH,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_MID,
		value: PromptHistoryScoreTier.MID,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_LOW,
		value: PromptHistoryScoreTier.LOW,
	},
	{
		label: PromptHistoryLabel.QUALITY_TIER_UNRATED,
		value: PromptHistoryScoreTier.UNRATED,
	},
];

export { QUALITY_TIER_OPTIONS };
