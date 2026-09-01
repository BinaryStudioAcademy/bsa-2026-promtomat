import { getValidClasses } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	message: string;
	variant?: "danger" | "success";
};

const FormAlert: React.FC<Properties> = ({
	message,
	variant = "danger",
}: Properties) => (
	<p
		className={getValidClasses(
			styles["alert"],
			variant === "success" && styles["success"],
		)}
		role={variant === "danger" ? "alert" : "status"}
	>
		{message}
	</p>
);

export { FormAlert };
