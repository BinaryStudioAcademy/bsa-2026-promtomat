import { FallbackScreen } from "~/libs/components/fallback-screen/fallback-screen.js";
import { AppRoute } from "~/libs/enums/app-route.enum.js";

const NoAccessPage: React.FC = () => (
	<main>
		<FallbackScreen
			actions={[
				{
					label: "Refresh the page",
					onClick() {
						location.reload();
					},
					variant: "primary",
				},
				{
					label: "Go to Previous Page",
					to: AppRoute.ROOT,
				},
			]}
			message="If you see this screen, the component rendered."
			title="A Fallback Screen"
		/>
	</main>
);

export { NoAccessPage };
