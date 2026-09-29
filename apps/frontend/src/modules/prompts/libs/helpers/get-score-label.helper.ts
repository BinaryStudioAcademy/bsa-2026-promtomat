import { PromptValidationRule } from "../enums/enums.js";

const getScoreLabel = (score: number): string =>
	`${String(score)}/${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`;

export { getScoreLabel };
