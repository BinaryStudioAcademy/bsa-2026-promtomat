import { getValidClasses } from "~/libs/helpers/helpers.js";
import { getErrorMessage } from "~/libs/modules/api/libs/helpers/get-error-message.helper.js";

import styles from "./styles.module.css";

type Properties = {
	error?: unknown;
	message?: string;
	variant?: "danger" | "success";
};

const FormAlert: React.FC<Properties> = ({
	error,
	message,
	variant = "danger",
}: Properties) => {
	const resolvedMessage = message ?? getErrorMessage(error);

	if (!resolvedMessage) {
		return null;
	}

	return (
		<p
			className={getValidClasses(
				styles["alert"],
				variant === "success" && styles["success"],
			)}
			role={variant === "danger" ? "alert" : "status"}
		>
			{resolvedMessage}
		</p>
	);
};

export { FormAlert };
