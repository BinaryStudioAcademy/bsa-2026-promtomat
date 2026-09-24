import React, { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { useForgotPasswordMutation } from "~/modules/auth/auth-api.js";

import { SettingsMessage } from "../../libs/enums/enums.js";
import { Section } from "../section/section.js";
import styles from "./styles.module.css";

type Properties = {
	email: string;
};

const Security: React.FC<Properties> = ({ email }: Properties) => {
	const [forgotPassword, { isLoading, isSuccess }] =
		useForgotPasswordMutation();

	const handleResetClick = useCallback((): void => {
		void forgotPassword({ email })
			.unwrap()
			.then(() => {
				showNotification({
					message: SettingsMessage.RESET_PASSWORD_SENT,
					type: "success",
				});
			});
	}, [email, forgotPassword]);

	return (
		<Section title="SECURITY">
			<div className={styles["security-row"]}>
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
			</div>
		</Section>
	);
};

export { Security };
