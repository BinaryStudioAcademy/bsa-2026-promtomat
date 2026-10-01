import { PageContainer } from "~/libs/components/page-container/page-container.js";
import { PageIntro } from "~/libs/components/page-intro/page-intro.js";

import { ApiTokensSection } from "./components/api-tokens-section/api-tokens-section.js";
import { ApiTokensPageMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const ApiTokensPage: React.FC = () => {
	return (
		<div className={styles["page"]}>
			<PageContainer>
				<div className={styles["container"]}>
					<PageIntro
						description={ApiTokensPageMessage.DESCRIPTION}
						label={ApiTokensPageMessage.KICKER}
						title={ApiTokensPageMessage.TITLE}
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
