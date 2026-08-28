import { useEffect, useRef } from "react";

import { type AppRoute, HTTPCode } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { Link } from "../link/link.js";
import styles from "./style.module.css";

const FOCUS_TAB_INDEX = -1;

type FallbackAction = { label: string; url: ValueOf<typeof AppRoute> };

type Properties = {
	action: FallbackAction;
	code?: ValueOf<typeof HTTPCode>;
	illustration?: string;
	message: string;
	title: string;
};

const FallbackScreen: React.FC<Properties> = ({
	action,
	code,
	illustration,
	message,
	title,
}: Properties) => {
	const headingReference = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		headingReference.current?.focus();
	}, []);

	return (
		<main className={styles["screen"]}>
			<div className={styles["layout"]}>
				{illustration ? (
					<img alt="" className={styles["illustration"]} src={illustration} />
				) : null}

				{code ? <p className={styles["code"]}>{code}</p> : null}

				<h1
					className={styles["heading"]}
					ref={headingReference}
					tabIndex={FOCUS_TAB_INDEX}
				>
					{title}
				</h1>

				<p className={styles["message"]}>{message}</p>

				<Link className={styles["action"] ?? ""} to={action.url}>
					{action.label}
				</Link>
			</div>
		</main>
	);
};

export { FallbackScreen };
