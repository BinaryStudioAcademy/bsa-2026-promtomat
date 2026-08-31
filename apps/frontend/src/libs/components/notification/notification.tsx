import styles from "./styles.module.css";

type Properties = {
	message: string;
};

const Notification = ({ message }: Properties) => {
	return (
		<p
			aria-atomic="true"
			aria-live="polite"
			className={styles["notification"]}
			role="status"
		>
			{message}
		</p>
	);
};

export { Notification };
