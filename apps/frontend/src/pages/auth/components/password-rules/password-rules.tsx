import { getValidClasses } from "~/libs/helpers/helpers.js";

import { PASSWORD_RULES } from "./libs/constants.js";
import styles from "./styles.module.css";

type Properties = {
	id: string;
	isSubmitted: boolean;
	password: string;
};

const PasswordRules: React.FC<Properties> = ({
	id,
	isSubmitted,
	password,
}: Properties) => {
	return (
		<ul className={styles["list"]} id={id}>
			{PASSWORD_RULES.map(({ label, validationSchema }) => {
				const isRuleMet =
					password !== "" && validationSchema.safeParse(password).success;
				const hasFailed = isSubmitted && !isRuleMet;
				return (
					<li
						className={getValidClasses(
							styles["rule"],
							isRuleMet && styles["met"],
							hasFailed && styles["failed"],
						)}
						key={label}
					>
						<span className={styles["icon"]} />
						{label}
					</li>
				);
			})}
		</ul>
	);
};

export { PasswordRules };
