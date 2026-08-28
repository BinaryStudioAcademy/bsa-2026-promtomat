import noAccessIllustration from "~/assets/img/no-access.svg";
import { FallbackScreen } from "~/libs/components/fallback-screen/fallback-screen.js";
import { AppRoute } from "~/libs/enums/app-route.enum.js";

import styles from "./style.module.css";

const NoAccessPage: React.FC = () => (
	<main>
		<FallbackScreen
			action={{ label: "Back Home", url: AppRoute.ROOT }}
			code="403"
			illustration={
				<img
					alt="lock-illustration"
					className={styles["illustration"]}
					src={noAccessIllustration}
				/>
			}
			message="Sorry, you are not allowed to access this page."
			title="Forbidden"
		/>
	</main>
);

export { NoAccessPage };
