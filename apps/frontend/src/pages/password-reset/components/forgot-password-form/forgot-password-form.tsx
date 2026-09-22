import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Input } from "~/libs/components/input/input.js";
import { Link } from "~/libs/components/link/link.js";
import { Logo } from "~/libs/components/logo/logo.js";
import { AppRoute, ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useForgotPasswordMutation } from "~/modules/auth/auth-api.js";
import {
	type ForgotPasswordRequestDto,
	forgotPasswordValidationSchema,
} from "~/modules/auth/auth.js";
import styles from "~/pages/password-reset/styles.module.css";

import {
	DEFAULT_FORGOT_PASSWORD_PAYLOAD,
	ForgotPasswordMessage,
} from "./libs/constants.js";

const ForgotPasswordForm: React.FC = () => {
	const [forgotPassword, { error, isLoading, isSuccess }] =
		useForgotPasswordMutation();

	const { control, handleSubmit } = useAppForm<ForgotPasswordRequestDto>({
		defaultValues: DEFAULT_FORGOT_PASSWORD_PAYLOAD,
		validationSchema: forgotPasswordValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(
				(payload: ForgotPasswordRequestDto) => void forgotPassword(payload),
			)(event);
		},
		[forgotPassword, handleSubmit],
	);

	if (isSuccess) {
		return (
			<>
				<Logo size={ControlSize.MD} />
				<div className={styles["head"]}>
					<h1 className={styles["heading"]}>
						{ForgotPasswordMessage.SENT_TITLE}
					</h1>
					<p className={styles["description"]}>
						{ForgotPasswordMessage.SENT_DESCRIPTION}
					</p>
				</div>
				<Link className={styles["action-link"]} to={AppRoute.SIGN_IN}>
					{ForgotPasswordMessage.BACK_TO_SIGN_IN}
				</Link>
			</>
		);
	}

	return (
		<>
			<Logo size={ControlSize.MD} />
			<div className={styles["head"]}>
				<h1 className={styles["heading"]}>{ForgotPasswordMessage.TITLE}</h1>
				<p className={styles["description"]}>
					{ForgotPasswordMessage.DESCRIPTION}
				</p>
			</div>
			<FormAlert error={error} />
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<Input
					control={control}
					label="Email"
					name="email"
					placeholder="Enter your email"
					type="email"
				/>
				<Button
					isDisabled={isLoading}
					label={
						isLoading
							? ForgotPasswordMessage.SENDING
							: ForgotPasswordMessage.SUBMIT
					}
					size={ControlSize.LG}
					type="submit"
				/>
			</form>
			<p className={styles["footer"]}>
				{ForgotPasswordMessage.FOOTER_LEAD}{" "}
				<Link to={AppRoute.SIGN_IN}>Sign in</Link>
			</p>
		</>
	);
};

export { ForgotPasswordForm };
