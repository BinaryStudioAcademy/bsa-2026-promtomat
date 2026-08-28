import { type AppRoute, HTTPCode } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { Link } from "../link/link.js";
import styles from "./style.module.css";

type FallbackAction = { label: string; url: ValueOf<typeof AppRoute> };

type Properties = {
	action: FallbackAction;
	code?: ValueOf<typeof HTTPCode>;
	illustrationUrl?: string;
	message: string;
	title: string;
};

const FallbackScreen: React.FC<Properties> = ({
	action,
	code,
	illustrationUrl,
	message,
	title,
}: Properties) => (
	<main className={styles["screen"]}>
		<div className={styles["layout"]}>
			{illustrationUrl ? (
				<img
					alt={title}
					className={styles["illustration"]}
					src={illustrationUrl}
				/>
			) : null}

			{code ? <span className={styles["code"]}>{code}</span> : null}

			<h1 className={styles["heading"]}>{title}</h1>

			<p className={styles["message"]}>{message}</p>

			<Link className={styles["action"] as string} to={action.url}>
				{action.label}
			</Link>
		</div>
	</main>
);

export { FallbackScreen };
