import { useCallback } from "react";
import {
	isRouteErrorResponse,
	useLocation,
	useNavigate,
	useRouteError,
} from "react-router-dom";

import errorIllustration from "~/assets/img/error-state.svg";
import { FallbackScreen } from "~/libs/components/fallback-screen/fallback-screen.js";
import { AppEnvironment, AppRoute } from "~/libs/enums/enums.js";
import { config } from "~/libs/modules/config/config.js";

import styles from "./styles.module.css";

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
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const handleRetry = useCallback(() => {
		void navigate(pathname, { replace: true });
	}, [navigate, pathname]);

	const hasDetails = config.ENV.APP.ENVIRONMENT !== AppEnvironment.PRODUCTION;

	return (
		<FallbackScreen
			actions={[
				{ label: "Try Again", onClick: handleRetry },
				{ label: "Back Home", to: AppRoute.ROOT, variant: "secondary" },
			]}
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
