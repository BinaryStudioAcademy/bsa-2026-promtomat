import styles from "./styles.module.css";

type Properties = {
	message: string;
};

const FormAlert: React.FC<Properties> = ({ message }: Properties) => (
	<p className={styles["alert"]} role="alert">
		{message}
	</p>
);

export { FormAlert };
