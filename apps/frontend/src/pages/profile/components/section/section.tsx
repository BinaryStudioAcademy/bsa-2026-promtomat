import React from "react";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	title: string;
};

const Section: React.FC<Properties> = ({ children, title }: Properties) => {
	return (
		<section className={styles["section"]}>
			<h2 className={styles["section-title"]}>{title}</h2>
			{children}
		</section>
	);
};

export { Section };
