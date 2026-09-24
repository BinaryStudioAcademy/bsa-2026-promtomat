import { ApiTokensMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

const SectionDescription: React.FC = () => {
	return (
		<p className={styles["description"]}>
			{ApiTokensMessage.SECTION_DESCRIPTION}
		</p>
	);
};

export { SectionDescription };
