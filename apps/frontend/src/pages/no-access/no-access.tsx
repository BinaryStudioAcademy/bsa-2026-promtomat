import { useId } from "react";

import { FallbackScreen } from "~/libs/components/fallback-screen/fallback-screen.js";
import { AppRoute } from "~/libs/enums/app-route.enum.js";

import "./no-access.css";

const NoAccessPage: React.FC = () => {
	const titleId = useId();
	const messageId = useId();

	return (
		<main
			aria-describedby={messageId}
			aria-labelledby={titleId}
			className="no-access-page-content"
			id="no-access-page"
			tabIndex={-1}
		>
			<FallbackScreen
				actions={[
					{
						className: "fallback-action fallback-action-primary",
						label: "Refresh the page",
						onClick() {
							location.reload();
						},
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
};

export { NoAccessPage };
