import noAccessIllustration from "~/assets/img/no-access.svg";
import { FallbackScreen } from "~/libs/components/fallback-screen/fallback-screen.js";
import { AppRoute, HTTPCode } from "~/libs/enums/enums.js";

const NoAccessPage: React.FC = () => (
	<FallbackScreen
		action={{ label: "Back Home", url: AppRoute.ROOT }}
		code={HTTPCode.FORBIDDEN}
		illustration={
			<img
				alt="lock-illustration"
				className={"illustration"}
				src={noAccessIllustration}
			/>
		}
		message="Sorry, you are not allowed to access this page."
		title="Forbidden"
	/>
);

export { NoAccessPage };
