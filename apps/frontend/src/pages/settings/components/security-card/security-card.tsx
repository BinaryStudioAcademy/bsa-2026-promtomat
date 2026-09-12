import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { useForgotPasswordMutation } from "~/modules/auth/auth-api.js";
import { SettingsMessage } from "~/pages/settings/libs/enums/enums.js";
import styles from "~/pages/settings/styles.module.css";

type Properties = {
	email: string;
};

const SecurityCard: React.FC<Properties> = ({ email }: Properties) => {
	const [forgotPassword, { error, isLoading, isSuccess }] =
		useForgotPasswordMutation();

	const handleResetClick = useCallback((): void => {
		void forgotPassword({ email });
	}, [email, forgotPassword]);

	return (
		<section className={styles["card"]}>
			<h2 className={styles["section-title"]}>SECURITY</h2>
			<Button
				isDisabled={isLoading || isSuccess}
				label={
					isLoading
						? SettingsMessage.RESET_PASSWORD_SENDING
						: SettingsMessage.RESET_PASSWORD
				}
				onClick={handleResetClick}
				size={ControlSize.LG}
				type="button"
				variant={ButtonVariant.SECONDARY}
			/>
			{isSuccess ? (
				<FormAlert
					message={SettingsMessage.RESET_PASSWORD_SENT}
					variant="success"
				/>
			) : (
				<FormAlert error={error} />
			)}
		</section>
	);
};

export { SecurityCard };
