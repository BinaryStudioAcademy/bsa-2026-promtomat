import React from "react";

import { Link } from "~/libs/components/link/link.js";
import { AppRoute } from "~/libs/enums/enums.js";

import { GenerateLabel, GenerateMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

const NoMatchesNotice: React.FC = () => (
	<p className={styles["notice-line"]}>
		<span className={styles["muted"]}>{GenerateMessage.NO_MATCHES}</span>
		<Link className={styles["accent"]} to={AppRoute.TRAINING}>
			{GenerateLabel.RECORD_PROMPT_LINK}
		</Link>
	</p>
);

export { NoMatchesNotice };
