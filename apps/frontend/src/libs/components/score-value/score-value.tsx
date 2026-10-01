import { formatScore, getScoreVariant } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	score: null | number;
};

const ScoreValue: React.FC<Properties> = ({ score }: Properties) => {
	return (
		<span className={styles[getScoreVariant(score)]}>{formatScore(score)}</span>
	);
};

export { ScoreValue };
