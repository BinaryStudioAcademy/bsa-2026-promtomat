import { FallbackScreen } from "~/libs/components/fallback-screen/fallback-screen.js";
import { AppRoute } from "~/libs/enums/app-route.enum.js";

const NoAccess: React.FC = () => (
	<FallbackScreen
		actions={[{ label: "Go to home", to: AppRoute.ROOT }]}
		message="Your account is not allowed to view this page."
		title="You don't have access to this page"
	/>
);

export { NoAccess };
