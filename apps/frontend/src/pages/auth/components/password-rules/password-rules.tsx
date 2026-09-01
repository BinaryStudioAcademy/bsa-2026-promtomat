import { Icon } from "~/libs/components/icon/icon.js";
import { IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import { PASSWORD_RULES } from "./libs/constants.js";
import { PasswordRuleMessage } from "./libs/enums/enums.js";
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
						<span className="visually-hidden">
							{isRuleMet
								? PasswordRuleMessage.MET
								: PasswordRuleMessage.NOT_MET}
						</span>
						<Icon className={styles["icon"]} iconName={IconName.CHECK} />
						{label}
					</li>
				);
			})}
		</ul>
	);
};

export { PasswordRules };
