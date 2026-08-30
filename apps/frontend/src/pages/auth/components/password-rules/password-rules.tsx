import { getValidClasses } from "~/libs/helpers/helpers.js";
import {
	AuthValidationMessage,
	AuthValidationRule,
	passwordFieldValidationSchema,
} from "~/modules/auth/auth.js";

import styles from "./styles.module.css";

type PasswordRule = {
	hasValidationIssue: boolean;
	label: string;
};

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
	const validationResult = passwordFieldValidationSchema.safeParse(password);
	const validationIssues = validationResult.success
		? []
		: validationResult.error.issues;

	const passwordRules: PasswordRule[] = [
		{
			hasValidationIssue: validationIssues.some(
				({ code }) => code === "too_small" || code === "too_big",
			),
			label: `Between ${String(AuthValidationRule.PASSWORD_MINIMUM_LENGTH)} and ${String(AuthValidationRule.PASSWORD_MAXIMUM_LENGTH)} characters`,
		},
		{
			hasValidationIssue: validationIssues.some(
				({ code, message }) =>
					code === "custom" &&
					message ===
						AuthValidationMessage.PASSWORD_HAS_LEADING_OR_TRAILING_SPACES,
			),
			label: AuthValidationMessage.PASSWORD_HAS_LEADING_OR_TRAILING_SPACES,
		},
	];
	return (
		<ul className={styles["list"]} id={id}>
			{passwordRules.map(({ hasValidationIssue, label }) => {
				const isRuleMet = password !== "" && !hasValidationIssue;
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
