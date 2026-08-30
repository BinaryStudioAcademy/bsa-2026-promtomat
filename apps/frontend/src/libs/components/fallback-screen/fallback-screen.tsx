import { type HTTPCode } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type NavigableRoute, type ValueOf } from "~/libs/types/types.js";

import { Link } from "../link/link.js";
import styles from "./styles.module.css";

type FallbackAction = {
	label: string;
	url: NavigableRoute;
};

type Properties = {
	action: FallbackAction;
	children?: React.ReactNode;
	className?: string | undefined;
	code?: ValueOf<typeof HTTPCode>;
	illustrationUrl?: string;
	message: string;
	title: string;
};

const FallbackScreen: React.FC<Properties> = ({
	action,
	children,
	className,
	code,
	illustrationUrl,
	message,
	title,
}: Properties) => (
	<main
		className={getValidClasses(
			styles["screen"],
			!illustrationUrl && styles["screen-glow"],
			className,
		)}
	>
		<div className={styles["layout"]}>
			{illustrationUrl ? (
				<div className={styles["illustration"]}>
					<img
						alt={title}
						className={styles["illustration-image"]}
						src={illustrationUrl}
					/>
				</div>
			) : null}

			{code ? <span className={styles["code"]}>{code}</span> : null}

			<h1 className={styles["heading"]}>{title}</h1>

			<p className={styles["message"]}>{message}</p>

			{children ? <div className={styles["details"]}>{children}</div> : null}

			<Link className={styles["action"]} to={action.url}>
				{action.label}
			</Link>
		</div>
	</main>
);

export { FallbackScreen };
