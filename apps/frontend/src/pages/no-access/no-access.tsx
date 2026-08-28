import noAccessIllustration from "~/assets/img/no-access.svg";
import { FallbackScreen } from "~/libs/components/fallback-screen/fallback-screen.js";
import { AppRoute, HTTPCode } from "~/libs/enums/enums.js";

const noAccessActions = [{ label: "Back Home", to: AppRoute.ROOT }];

const NoAccessPage: React.FC = () => (
	<FallbackScreen
		actions={noAccessActions}
		code={HTTPCode.FORBIDDEN}
		illustrationUrl={noAccessIllustration}
		message="Sorry, you are not allowed to access this page."
		title="Forbidden"
	/>
);

export { NoAccessPage };
