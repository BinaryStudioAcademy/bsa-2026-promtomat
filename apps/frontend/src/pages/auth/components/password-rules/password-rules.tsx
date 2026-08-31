import { getValidClasses } from "~/libs/helpers/helpers.js";
import {
	AuthValidationMessage,
	AuthValidationRule,
	passwordBoundarySpacesValidationSchema,
	passwordLengthValidationSchema,
} from "~/modules/auth/auth.js";

import styles from "./styles.module.css";

type Properties = {
	id: string;
	isSubmitted: boolean;
	password: string;
};

const passwordRules = [
	{
		label: `Between ${String(AuthValidationRule.PASSWORD_MINIMUM_LENGTH)} and ${String(AuthValidationRule.PASSWORD_MAXIMUM_LENGTH)} characters`,
		validationSchema: passwordLengthValidationSchema,
	},
	{
		label: AuthValidationMessage.PASSWORD_HAS_LEADING_OR_TRAILING_SPACES,
		validationSchema: passwordBoundarySpacesValidationSchema,
	},
];

const PasswordRules: React.FC<Properties> = ({
	id,
	isSubmitted,
	password,
}: Properties) => {
	return (
		<ul className={styles["list"]} id={id}>
			{passwordRules.map(({ label, validationSchema }) => {
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
						<svg
							aria-hidden="true"
							className={styles["icon"]}
							viewBox="0 0 12 12"
						>
							{isRuleMet ? (
								<polyline points="2.5 6.5 5 9 9.5 3.5" />
							) : (
								<circle cx="6" cy="6" r="5" />
							)}
						</svg>
						{label}
					</li>
				);
			})}
		</ul>
	);
};

export { PasswordRules };
