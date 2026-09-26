import { ButtonVariant } from "~/libs/enums/enums.js";

import { ScoreDescription } from "../enums/score-description.enum.js";

const SCORE_RANGE = Object.keys(ScoreDescription).map(Number);

const INSET_SOLID_CLASS_NAME: Record<string, string> = {
	[ButtonVariant.DANGER_OUTLINE]: "score-button-solid-danger",
	[ButtonVariant.SUCCESS_OUTLINE]: "score-button-solid-success",
	[ButtonVariant.WARNING_OUTLINE]: "score-button-solid-warning",
};

export { INSET_SOLID_CLASS_NAME, SCORE_RANGE };
