import { getValidClasses } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
	description?: string;
	label: string;
	title: string;
};

const PageIntro: React.FC<Properties> = ({
	className,
	description,
	label,
	title,
}: Properties) => {
	return (
		<div className={getValidClasses(styles["intro"], className)}>
			<p className={styles["label"]}>{label}</p>
			<h2 className={styles["title"]}>{title}</h2>
			{description && <p className={styles["description"]}>{description}</p>}
		</div>
	);
};

export { PageIntro };
