import React, { useCallback } from "react";

import { ButtonLink } from "~/libs/components/button-link/button-link.js";
import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { AppRoute, ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { useResetOnCooldownEnd } from "~/libs/hooks/use-reset-on-cooldown-end/use-reset-on-cooldown-end.hook.js";
import { isRateLimitError } from "~/libs/modules/api/libs/helpers/is-rate-limit-error.helper.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { useForgotPasswordMutation } from "~/modules/auth/auth-api.js";

import { SettingsMessage } from "../../libs/enums/enums.js";
import { Section } from "../section/section.js";
import styles from "./styles.module.css";

type Properties = {
	email: string;
};

const Security: React.FC<Properties> = ({ email }: Properties) => {
	const [forgotPassword, { error, isLoading, reset }] =
		useForgotPasswordMutation();

	useResetOnCooldownEnd(error, reset);

	const isCoolingDown =
		isRateLimitError(error) && error.retryAfterSeconds !== null;

	const handleResetClick = useCallback((): void => {
		void forgotPassword({ email }).then((result) => {
			if (!result.error) {
				showNotification({
					message: SettingsMessage.RESET_PASSWORD_SENT,
					type: "success",
				});
			}
		});
	}, [email, forgotPassword]);

	return (
		<Section title="SECURITY">
			<div className={styles["security-row"]}>
				<Button
					className={styles["button"]}
					isDisabled={isLoading || isCoolingDown}
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
				<ButtonLink
					className={styles["button"]}
					label={SettingsMessage.MANAGE_API_TOKENS}
					size={ControlSize.LG}
					to={AppRoute.API_TOKENS}
					variant={ButtonVariant.SECONDARY}
				/>
			</div>
			{isRateLimitError(error) && <FormAlert error={error} />}
		</Section>
	);
};

export { Security };
