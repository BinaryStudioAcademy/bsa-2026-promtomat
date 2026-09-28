import {
	PromptQualityTier,
	QualityScoreThreshold,
} from "~/modules/prompts/libs/enums/enums.js";

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

	if (computedScore === null) {
		return false;
	}

	switch (qualityTier) {
		case PromptQualityTier.NEEDS_IMPROVEMENT: {
			return (
				computedScore >= QualityScoreThreshold.MIN_NEEDS_IMPROVEMENT &&
				computedScore < QualityScoreThreshold.MAX_NEEDS_IMPROVEMENT
			);
		}
		case PromptQualityTier.PROVEN: {
			return computedScore >= QualityScoreThreshold.PROVEN;
		}
		case PromptQualityTier.USABLE: {
			return (
				computedScore >= QualityScoreThreshold.USABLE &&
				computedScore < QualityScoreThreshold.PROVEN
			);
		}
		default: {
			return false;
		}
	}
};

export { checkMatchesQualityTier };
