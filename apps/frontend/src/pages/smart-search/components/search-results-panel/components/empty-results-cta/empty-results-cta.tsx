import React from "react";

import styles from "./styles.module.css";

const EmptyResultsCta: React.FC = () => {
	return (
		<p className={styles["footer"]}>
			<span className={styles["muted"]}>Can&apos;t find the right prompt?</span>
			<span className={styles["accent"]}>Then generate it.</span>
		</p>
	);
};

export { EmptyResultsCta };
