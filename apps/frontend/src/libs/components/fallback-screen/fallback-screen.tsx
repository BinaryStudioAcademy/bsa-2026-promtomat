import { useEffect, useRef } from "react";

import { type AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { Link } from "../link/link.js";

const FOCUS_TAB_INDEX = -1;

type FallbackAction =
	| { label: string; onClick: () => void }
	| { label: string; to: ValueOf<typeof AppRoute> };

type Properties = {
	actions?: FallbackAction[];
	children?: React.ReactNode;
	message: React.ReactNode;
	title: string;
};

const renderAction = (action: FallbackAction): React.JSX.Element =>
	"to" in action ? (
		<Link key={action.label} to={action.to}>
			{action.label}
		</Link>
	) : (
		<button key={action.label} onClick={action.onClick}>
			{action.label}
		</button>
	);

const FallbackScreen: React.FC<Properties> = ({
	actions = [],
	children,
	message,
	title,
}: Properties) => {
	const headingReference = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		headingReference.current?.focus();
	}, []);

	return (
		<div>
			<h1 ref={headingReference} tabIndex={FOCUS_TAB_INDEX}>
				{title}
			</h1>

			<div>{message}</div>
			<div>{actions.map((action) => renderAction(action))}</div>

			{children && <div>{children}</div>}
		</div>
	);
};

export { FallbackScreen };
