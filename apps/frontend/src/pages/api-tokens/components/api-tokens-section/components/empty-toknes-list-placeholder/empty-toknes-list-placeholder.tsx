import { ApiTokensMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

const EmptyTokenListPlaceholder = () => {
	return <p className={styles["empty"]}>{ApiTokensMessage.EMPTY}</p>;
};

export { EmptyTokenListPlaceholder };
