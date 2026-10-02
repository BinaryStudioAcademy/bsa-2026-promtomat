import { Icon } from "~/libs/components/icon/icon.js";
import { Link } from "~/libs/components/link/link.js";
import { PageContainer } from "~/libs/components/page-container/page-container.js";
import { PageIntro } from "~/libs/components/page-intro/page-intro.js";
import { AppRoute, IconName } from "~/libs/enums/enums.js";

import { ApiTokensSection } from "./components/api-tokens-section/api-tokens-section.js";
import { ApiTokensPageMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const ApiTokensPage: React.FC = () => {
	return (
		<div className={styles["page"]}>
			<PageContainer>
				<div className={styles["container"]}>
					<Link
						className={styles["back-link"]}
						hasDefaultStyles={false}
						to={AppRoute.PROFILE}
					>
						<Icon className={styles["back-icon"]} iconName={IconName.CHEVRON} />
						Profile
					</Link>
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
