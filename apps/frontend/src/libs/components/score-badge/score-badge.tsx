import { getValidClasses } from "~/libs/helpers/helpers.js";
import { PromptValidationRule } from "~/modules/prompts/libs/enums/enums.js";

import { getScoreVariant } from "./libs/helpers/get-score-variant.helper.js";
import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
	efficiencyScore: null | number;
	isFill?: boolean | undefined;
};

const ScoreBadge: React.FC<Properties> = ({
	className,
	efficiencyScore,
	isFill = true,
}: Properties) => {
	const variant = getScoreVariant(efficiencyScore);
	const label =
		efficiencyScore === null
			? "Unrated"
			: `${String(efficiencyScore)}/${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`;

	return (
		<span
			className={getValidClasses(
				styles["badge"],
				isFill && styles["filled"],
				styles[variant],
				className,
			)}
		>
			{label}
		</span>
	);
};

export { ScoreBadge };
