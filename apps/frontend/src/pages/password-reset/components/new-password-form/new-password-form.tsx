import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Input } from "~/libs/components/input/input.js";
import { Link } from "~/libs/components/link/link.js";
import { Logo } from "~/libs/components/logo/logo.js";
import { AppRoute, ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useResetPasswordMutation } from "~/modules/auth/auth-api.js";
import {
	type NewPasswordFormValues,
	newPasswordValidationSchema,
} from "~/modules/auth/auth.js";
import styles from "~/pages/password-reset/styles.module.css";

import {
	DEFAULT_NEW_PASSWORD_PAYLOAD,
	NewPasswordMessage,
	TOKEN_QUERY_PARAMETER,
} from "./libs/constants.js";

const NewPasswordForm: React.FC = () => {
	const [searchParameters] = useSearchParams();
	const token = searchParameters.get(TOKEN_QUERY_PARAMETER) ?? "";

	const [resetPassword, { error, isLoading, isSuccess }] =
		useResetPasswordMutation();

	const { control, handleSubmit } = useAppForm<NewPasswordFormValues>({
		defaultValues: DEFAULT_NEW_PASSWORD_PAYLOAD,
		validationSchema: newPasswordValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(
				({ password }: NewPasswordFormValues) =>
					void resetPassword({ password, token }),
			)(event);
		},
		[handleSubmit, resetPassword, token],
	);

	if (isSuccess) {
		return (
			<>
				<Logo size={ControlSize.MD} />
				<div className={styles["head"]}>
					<h1 className={styles["heading"]}>{NewPasswordMessage.DONE_TITLE}</h1>
					<p className={styles["description"]}>
						{NewPasswordMessage.DONE_DESCRIPTION}
					</p>
				</div>
				<Link className={styles["action-link"]} to={AppRoute.SIGN_IN}>
					{NewPasswordMessage.GO_TO_SIGN_IN}
				</Link>
			</>
		);
	}

	// A link with no token cannot be consumed, so it is reported the same way the
	// API reports a consumed or unknown one rather than being submitted first.
	const linkAlert = token
		? { error }
		: { message: NewPasswordMessage.LINK_INVALID };

	return (
		<>
			<Logo size={ControlSize.MD} />
			<div className={styles["head"]}>
				<h1 className={styles["heading"]}>{NewPasswordMessage.TITLE}</h1>
				<p className={styles["description"]}>
					{NewPasswordMessage.DESCRIPTION}
				</p>
			</div>
			<FormAlert {...linkAlert} />
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<Input
					control={control}
					label="New password"
					name="password"
					placeholder="Enter a new password"
					type="password"
				/>
				<Input
					control={control}
					label="Confirm password"
					name="confirmPassword"
					placeholder="Repeat the new password"
					type="password"
				/>
				<Button
					isDisabled={isLoading || !token}
					label={
						isLoading ? NewPasswordMessage.SETTING : NewPasswordMessage.SUBMIT
					}
					size={ControlSize.LG}
					type="submit"
				/>
			</form>
			<p className={styles["footer"]}>
				{NewPasswordMessage.FOOTER_LEAD}{" "}
				<Link to={AppRoute.FORGOT_PASSWORD}>Request a new one</Link>
			</p>
		</>
	);
};

export { NewPasswordForm };
