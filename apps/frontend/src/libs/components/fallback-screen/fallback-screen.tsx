import { useEffect, useRef } from "react";

import { type AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { Button } from "../button/button.js";
import { Link } from "../link/link.js";
import styles from "./styles.module.css";

const EMPTY_ACTIONS_COUNT = 0;
const HEADING_TAB_INDEX = -1;

type FallbackAction =
	| { label: string; onClick: () => void }
	| { label: string; to: FallbackActionRoute };

type FallbackActionRoute = Exclude<
	ValueOf<typeof AppRoute>,
	typeof AppRoute.ANY
>;

type Properties = {
	actions?: FallbackAction[];
	children?: React.ReactNode;
	code?: number;
	illustration?: React.ReactNode;
	message: string;
	title: string;
};

const renderAction = (action: FallbackAction): React.JSX.Element =>
	"to" in action ? (
		<Link className={styles["action"]} key={action.label} to={action.to}>
			{action.label}
		</Link>
	) : (
		<Button
			className={styles["action"]}
			key={action.label}
			label={action.label}
			onClick={action.onClick}
			type="button"
		/>
	);

const FallbackScreen: React.FC<Properties> = ({
	actions = [],
	children,
	code,
	illustration,
	message,
	title,
}: Properties) => {
	const headingReference = useRef<HTMLHeadingElement | null>(null);

	useEffect(() => {
		headingReference.current?.focus();
	}, []);

	const hasActions = actions.length > EMPTY_ACTIONS_COUNT;

	return (
		<main className={styles["screen"]}>
			<div className={styles["layout"]}>
				{illustration ? (
					<div aria-hidden="true" className={styles["illustration"]}>
						{illustration}
					</div>
				) : null}

				{code ? <p className={styles["code"]}>{code}</p> : null}

				<h1
					className={styles["heading"]}
					ref={headingReference}
					tabIndex={HEADING_TAB_INDEX}
				>
					{title}
				</h1>

				<div className={styles["message"]}>{message}</div>

				{children ? <div className={styles["details"]}>{children}</div> : null}

				{hasActions ? (
					<div className={styles["action-container"]}>
						{actions.map((action) => renderAction(action))}
					</div>
				) : null}
			</div>
		</main>
	);
};

export { FallbackScreen };
