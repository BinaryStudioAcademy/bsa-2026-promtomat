import { ApiTokensMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

const EmptyTokenListPlaceholder: React.FC = () => {
	return <p className={styles["empty"]}>{ApiTokensMessage.EMPTY}</p>;
};

export { EmptyTokenListPlaceholder };
