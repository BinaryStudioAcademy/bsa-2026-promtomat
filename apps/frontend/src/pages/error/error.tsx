import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import errorIllustration from "~/assets/img/error-state.svg";
import { FallbackScreen } from "~/libs/components/fallback-screen/fallback-screen.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { isDebugEnvironment } from "~/libs/helpers/helpers.js";
import { config } from "~/libs/modules/config/config.js";

import styles from "./styles.module.css";

const errorAction = { label: "Back Home", url: AppRoute.ROOT };

const getErrorDetails = (error: unknown): string => {
	if (isRouteErrorResponse(error)) {
		return `${String(error.status)} ${error.statusText}`;
	}

	if (error instanceof Error) {
		return error.stack ?? error.message;
	}

	return String(error);
};

const ErrorPage: React.FC = () => {
	const error = useRouteError();

	const hasDetails = isDebugEnvironment(config.ENV.APP.ENVIRONMENT);

	return (
		<FallbackScreen
			action={errorAction}
			className={styles["screen"]}
			illustrationUrl={errorIllustration}
			message="An unexpected error occurred."
			title="Something went wrong"
		>
			{hasDetails ? (
				<pre className={styles["details"]}>{getErrorDetails(error)}</pre>
			) : null}
		</FallbackScreen>
	);
};

export { ErrorPage };
