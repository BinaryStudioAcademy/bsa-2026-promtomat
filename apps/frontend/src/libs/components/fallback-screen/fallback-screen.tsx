import { type AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { NoAccessIllustration } from "~/pages/no-access/no-access-illustration.js";

import { Button } from "../button/button.js";
import { Link } from "../link/link.js";
import styles from "./fallback-screen.module.css";

const EMPTY_ACTIONS_COUNT = 0;

type FallbackAction =
	| { label: string; onClick: () => void; variant?: FallbackActionVariant }
	| { label: string; to: FallbackActionRoute; variant?: FallbackActionVariant };

type FallbackActionRoute = ValueOf<typeof AppRoute>;

type FallbackActionVariant = "primary" | "secondary";

type Properties = {
	actions?: FallbackAction[];
	children?: React.ReactNode;
	illustration?: React.ReactNode;
	message: React.ReactNode;
	title: string;
};

const getActionClassName = (variant: FallbackActionVariant): string => {
	const variantClassName =
		variant === "primary" ? styles["actionPrimary"] : styles["actionSecondary"];

	return [styles["action"], variantClassName].join(" ");
};

const renderAction = (action: FallbackAction): React.JSX.Element => {
	const className = getActionClassName(action.variant ?? "secondary");

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
	illustration,
	message,
	title,
}: Properties) => {
	const hasActions = actions.length > EMPTY_ACTIONS_COUNT;
	const illustrationClassName = styles["illustration"];

	return (
		<div className={styles["screen"]}>
			<div className={styles["layout"]}>
				{illustration ?? (
					<NoAccessIllustration
						{...(illustrationClassName === undefined
							? {}
							: { className: illustrationClassName })}
					/>
				)}

				<h1 className={styles["heading"]}>{title}</h1>

				<div className={styles["message"]}>{message}</div>

				{children ? <div className={styles["details"]}>{children}</div> : null}

				{hasActions ? (
					<div className={styles["actions"]}>
						{actions.map((action) => renderAction(action))}
					</div>
				) : null}
			</div>
		</div>
	);
};

export { FallbackScreen };
