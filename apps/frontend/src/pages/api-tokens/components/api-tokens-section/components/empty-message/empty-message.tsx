import { ApiTokensMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

type Properties = {
	hasTokens: boolean;
	isLoading: boolean;
};

const EmptyMessage = ({ hasTokens, isLoading }: Properties) => {
	if (isLoading || hasTokens) {
		return null;
	}

	return <p className={styles["empty"]}>{ApiTokensMessage.EMPTY}</p>;
};

export { EmptyMessage };
