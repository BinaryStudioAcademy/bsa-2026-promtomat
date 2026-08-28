import { clsx } from "clsx";
import { useEffect, useRef } from "react";

import { type AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { Button } from "../button/button.js";
import { Link } from "../link/link.js";
import styles from "./styles.module.css";

const EMPTY_ACTIONS_COUNT = 0;
const HEADING_TAB_INDEX = -1;

type FallbackAction =
	| { label: string; onClick: () => void; variant?: FallbackActionVariant }
	| { label: string; to: FallbackActionRoute; variant?: FallbackActionVariant };

type FallbackActionRoute = Exclude<
	ValueOf<typeof AppRoute>,
	typeof AppRoute.ANY
>;

type FallbackActionVariant = "primary" | "secondary";

type Properties = {
	actions?: FallbackAction[];
	children?: React.ReactNode;
	className?: string | undefined;
	code?: number;
	illustration?: React.ReactNode;
	message: string;
	title: string;
};

const getActionClassName = (variant: FallbackActionVariant): string =>
	clsx(
		styles["action"],
		variant === "primary"
			? styles["action-primary"]
			: styles["action-secondary"],
	);

const renderAction = (action: FallbackAction): React.JSX.Element => {
	const className = getActionClassName(action.variant ?? "primary");

	return "to" in action ? (
		<Link className={className} key={action.label} to={action.to}>
			{action.label}
		</Link>
	) : (
		<Button
			className={className}
			key={action.label}
			label={action.label}
			onClick={action.onClick}
			type="button"
		/>
	);
};

const FallbackScreen: React.FC<Properties> = ({
	actions = [],
	children,
	className,
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
		<main className={clsx(styles["screen"], className)}>
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
