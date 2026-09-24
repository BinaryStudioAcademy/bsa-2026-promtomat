import { getValidClasses } from "~/libs/helpers/helpers.js";

import { ApiTokensSection } from "./components/api-tokens-section/api-tokens-section.js";
import { ApiTokensMessage } from "./components/api-tokens-section/libs/enums/enums.js";
import { ApiTokensPageMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const ApiTokensPage: React.FC = () => {
	return (
		<main className={styles["page"]}>
			<div className={getValidClasses("page-container", styles["container"])}>
				<p className={styles["kicker"]}>{ApiTokensPageMessage.KICKER}</p>
				<h1 className={styles["title"]}>{ApiTokensMessage.SECTION_TITLE}</h1>
				<section className={styles["card"]}>
					<ApiTokensSection />
				</section>
			</div>
		</main>
	);
};

export { ApiTokensPage };
