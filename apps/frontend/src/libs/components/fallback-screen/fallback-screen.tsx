import { type AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { NoAccessIllustration } from "~/pages/no-access/no-access-illustration.js";

import { Link } from "../link/link.js";
import "./fallback-screen.css";

const EMPTY_ACTIONS_COUNT = 0;

type FallbackAction =
	| { className: string; label: string; onClick: () => void } // TODO: after button develop, user type of property here
	| { label: string; to: ValueOf<typeof AppRoute> };

type Properties = {
	actions?: FallbackAction[];
	children?: React.ReactNode;
	illustration?: React.ReactNode;
	message: React.ReactNode;
	title: string;
};

const renderAction = (action: FallbackAction): React.JSX.Element =>
	"to" in action ? (
		<Link key={action.label} to={action.to}>
			{action.label}
		</Link>
	) : (
		// TODO: will change button using developed component when it is ready
		<button
			className={action.className}
			key={action.label}
			onClick={action.onClick}
		>
			{action.label}
		</button>
	);

const FallbackScreen: React.FC<Properties> = ({
	actions = [],
	children,
	illustration,
	message,
	title,
}: Properties) => {
	const hasActions = actions.length > EMPTY_ACTIONS_COUNT;

	return (
		<div className="fallback-screen-component">
			<div className="fallback-screen-layout">
				<div className="fallback-screen-ilustration">
					{illustration || (
						// TODO; temporary untill we fixed the placeholder svg assets
						<NoAccessIllustration className="fallback-screen-illustration" />
					)}
				</div>

				<h1 className="fallback-screen-heading" id={`title-header-${title}`}>
					{title}
				</h1>

				<div className="fallback-screen-message" id={`message-${title}`}>
					{message}
				</div>

				{children ? (
					<div className="fallback-screen-details">{children}</div>
				) : null}

				{hasActions ? (
					<div className="fallback-screen-actions">
						{actions.map((action) => renderAction(action))}
					</div>
				) : null}
			</div>
		</div>
	);
};

export { FallbackScreen };
