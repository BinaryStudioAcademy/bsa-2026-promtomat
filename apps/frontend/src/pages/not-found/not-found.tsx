import notFoundIllustration from "~/assets/img/not-found-state.svg";
import { FallbackScreen } from "~/libs/components/fallback-screen/fallback-screen.js";
import { AppRoute, HTTPCode } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

const notFoundActions = [{ label: "Back Home", to: AppRoute.ROOT }];

const NotFoundPage: React.FC = () => (
	<FallbackScreen
		actions={notFoundActions}
		className={styles["screen"]}
		code={HTTPCode.NOT_FOUND}
		illustrationUrl={notFoundIllustration}
		message="The page you are looking for does not exist or has been moved."
		title="Page not found"
	/>
);

export { NotFoundPage };
