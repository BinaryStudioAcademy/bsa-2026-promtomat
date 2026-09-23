import React, { useId } from "react";

import styles from "./styles.module.css";

type Properties = {
	aside?: React.ReactNode;
	children: React.ReactNode;
	description?: string | undefined;
	title: string;
};

const DashboardCard: React.FC<Properties> = ({
	aside,
	children,
	description,
	title,
}: Properties) => {
	const titleId = useId();

	return (
		<section aria-labelledby={titleId} className={styles["card"]}>
			<header className={styles["header"]}>
				<div className={styles["heading"]}>
					<h2 className={styles["title"]} id={titleId}>
						{title}
					</h2>
					{description && (
						<p className={styles["description"]}>{description}</p>
					)}
				</div>
				{aside}
			</header>
			{children}
		</section>
	);
};

export { DashboardCard };
