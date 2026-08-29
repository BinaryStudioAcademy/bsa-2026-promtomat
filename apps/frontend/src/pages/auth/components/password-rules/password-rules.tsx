import { getValidClasses } from "~/libs/helpers/helpers.js";
import { AuthValidationRule } from "~/modules/auth/auth.js";

import styles from "./styles.module.css";

type PasswordRule = {
	check: (password: string) => boolean;
	label: string;
};

type Properties = {
	id: string;
	isSubmitted: boolean;
	password: string;
};

const PASSWORD_RULES: PasswordRule[] = [
	{
		check: (password: string): boolean =>
			password.length >= AuthValidationRule.PASSWORD_MINIMUM_LENGTH &&
			password.length <= AuthValidationRule.PASSWORD_MAXIMUM_LENGTH,
		label: `Between ${String(AuthValidationRule.PASSWORD_MINIMUM_LENGTH)} and ${String(AuthValidationRule.PASSWORD_MAXIMUM_LENGTH)} characters`,
	},
	{
		check: (password: string): boolean => password === password.trim(),
		label: "No spaces at the start or end",
	},
];

const PasswordRules: React.FC<Properties> = ({
	id,
	isSubmitted,
	password,
}: Properties) => (
	<ul className={styles["list"]} id={id}>
		{PASSWORD_RULES.map(({ check, label }) => {
			const isRuleMet = password !== "" && check(password);
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

export { PasswordRules };
