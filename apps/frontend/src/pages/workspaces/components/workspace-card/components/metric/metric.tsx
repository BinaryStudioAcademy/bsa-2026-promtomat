import styles from "./styles.module.css";

type Properties = {
	label: string;
	value: number | string;
};

const Metric: React.FC<Properties> = ({ label, value }: Properties) => {
	return (
		<div className={styles["metric"]}>
			<span className={styles["label"]}>{label}</span>
			<span className={styles["value"]}>{value}</span>
		</div>
	);
};

export { Metric };
