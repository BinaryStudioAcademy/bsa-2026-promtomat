import { ScoreTierMin } from "~/libs/enums/enums.js";
import { PromptHistoryScoreTier } from "~/modules/prompt-history/libs/enums/enums.js";

const checkMatchesQualityTier = (
	computedScore: null | number,
	qualityTier?: string,
): boolean => {
	if (!qualityTier || qualityTier === PromptHistoryScoreTier.ALL) {
		return true;
	}

	if (qualityTier === PromptHistoryScoreTier.UNRATED) {
		return computedScore === null;
	}

	if (computedScore === null) {
		return false;
	}

	switch (qualityTier) {
		case PromptHistoryScoreTier.HIGH: {
			return computedScore >= ScoreTierMin.HIGH;
		}
		case PromptHistoryScoreTier.LOW: {
			return computedScore < ScoreTierMin.MID;
		}
		case PromptHistoryScoreTier.MID: {
			return (
				computedScore >= ScoreTierMin.MID && computedScore < ScoreTierMin.HIGH
			);
		}
		default: {
			return false;
		}
	}
};

export { checkMatchesQualityTier };
