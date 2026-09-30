import { getValidClasses } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	className?: string | undefined;
};

const PageContainer: React.FC<Properties> = ({
	children,
	className,
}: Properties) => (
	<div
		className={getValidClasses(
			"page-container",
			styles["container"],
			className,
		)}
	>
		{children}
	</div>
);

export { PageContainer };
