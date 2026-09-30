import { PageContainer } from "~/libs/components/page-container/page-container.js";
import { PageIntro } from "~/libs/components/page-intro/page-intro.js";

import { ApiTokensSection } from "./components/api-tokens-section/api-tokens-section.js";
import { ApiTokensMessage } from "./components/api-tokens-section/libs/enums/enums.js";
import { ApiTokensPageMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const ApiTokensPage: React.FC = () => {
	return (
		<div className={styles["page"]}>
			<PageContainer>
				<div className={styles["container"]}>
					<PageIntro
						label={ApiTokensPageMessage.KICKER}
						title={ApiTokensMessage.SECTION_TITLE}
					/>
					<section className={styles["card"]}>
						<ApiTokensSection />
					</section>
				</div>
			</PageContainer>
		</div>
	);
};

export { ApiTokensPage };
