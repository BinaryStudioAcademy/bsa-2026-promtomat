import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	label: string;
};

const StatGrid: React.FC<Properties> = ({ children, label }: Properties) => {
	return (
		<section aria-label={label}>
			<dl className={styles["grid"]}>{children}</dl>
		</section>
	);
};

export { StatGrid };
