import { type AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { Link } from "../link/link.js";
import styles from "./fallback-screen.module.css";

type FallbackAction = { label: string; url: ValueOf<typeof AppRoute> };

type Properties = {
	action: FallbackAction;
	children?: React.ReactNode;
	code?: string;
	illustration?: React.ReactNode;
	message: React.ReactNode;
	title: string;
};

const FallbackScreen: React.FC<Properties> = ({
	action,
	children,
	code,
	illustration,
	message,
	title,
}: Properties) => {
	return (
		<div className={styles["screen"]}>
			<div className={styles["layout"]}>
				{illustration}

				{code ? <p className={styles["code"]}>{code}</p> : null}

				<h1 className={styles["heading"]}>{title}</h1>

				<div className={styles["message"]}>{message}</div>

				{children ? <div className={styles["details"]}>{children}</div> : null}

				<div className={styles["action-container"]}>
					<Link className={styles["action"]} to={action.url}>
						{action.label}
					</Link>
				</div>
			</div>
		</div>
	);
};

export { FallbackScreen };
