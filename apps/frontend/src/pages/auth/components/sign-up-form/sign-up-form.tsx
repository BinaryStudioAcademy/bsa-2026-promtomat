import { useCallback, useEffect, useId, useState } from "react";
import { useFormState, useWatch } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Input } from "~/libs/components/input/input.js";
import { Link } from "~/libs/components/link/link.js";
import { AppRoute, ControlSize, ErrorCode } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import {
	AuthValidationRule,
	type SignUpRequestDto,
	signUpValidationSchema,
} from "~/modules/auth/auth.js";

import styles from "../../styles.module.css";
import { PasswordRules } from "../password-rules/password-rules.js";
import { DEFAULT_SIGN_UP_PAYLOAD } from "./libs/constants.js";
import { SignUpFormMessage } from "./libs/enums/enums.js";

type Properties = {
	error: unknown;
	isLoading: boolean;
	isSuccess: boolean;
	onSubmit: (payload: SignUpRequestDto) => void;
};

const SignUpForm: React.FC<Properties> = ({
	error,
	isLoading,
	isSuccess,
	onSubmit,
}: Properties) => {
	const isDisabled = isLoading || isSuccess;
	const { control, handleSubmit, setError } = useAppForm<SignUpRequestDto>({
		defaultValues: DEFAULT_SIGN_UP_PAYLOAD,
		isDisabled,
		mode: "onTouched",
		validationSchema: signUpValidationSchema,
	});

	const passwordRulesId = useId();
	const [hasPasswordBeenFocused, setHasPasswordBeenFocused] = useState(false);
	const password = useWatch({ control, name: "password" });
	const { isSubmitted } = useFormState({ control });

	useEffect(() => {
		if (!isServerError(error)) {
			return;
		}

		if (error.code === ErrorCode.AUTH_EMAIL_ALREADY_EXISTS) {
			setError("email", { type: "server" });
		}
		if (error.code === ErrorCode.AUTH_NICKNAME_ALREADY_EXISTS) {
			setError("nickname", { type: "server" });
		}
	}, [error, setError]);

	const handlePasswordFocus = useCallback((): void => {
		setHasPasswordBeenFocused(true);
	}, []);

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(onSubmit)(event_);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<>
			<h1 className={styles["heading"]}>Sign up</h1>
			<FormAlert error={error} />
			{isSuccess ? (
				<FormAlert message={SignUpFormMessage.SUCCESS} variant="success" />
			) : null}
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<div className={styles["input-wrapper"]}>
					<Input
						control={control}
						label="Nickname"
						maxLength={AuthValidationRule.NICKNAME_MAXIMUM_LENGTH}
						name="nickname"
						placeholder="Enter a nickname"
						type="text"
					/>
					<Input
						control={control}
						label="Email"
						name="email"
						placeholder="Enter your email"
						type="email"
					/>
					<div className={styles["password-field"]}>
						<Input
							control={control}
							descriptionId={passwordRulesId}
							label="Password"
							name="password"
							onFocus={handlePasswordFocus}
							placeholder="Enter your password"
							type="password"
						/>
						<div
							className={getValidClasses(
								styles["rules"],
								(hasPasswordBeenFocused || isSubmitted) &&
									styles["rules-shown"],
							)}
						>
							<div className={styles["rules-inner"]}>
								<PasswordRules
									id={passwordRulesId}
									isSubmitted={isSubmitted}
									password={password}
								/>
							</div>
						</div>
					</div>
				</div>
				<Button
					isDisabled={isDisabled}
					label={
						isLoading ? SignUpFormMessage.SUBMITTING : SignUpFormMessage.SUBMIT
					}
					size={ControlSize.LG}
					type="submit"
				/>
			</form>
			<p className={styles["footer"]}>
				Already have an account?{" "}
				<Link className={styles["inline-link"]} to={AppRoute.SIGN_IN}>
					Sign in
				</Link>
			</p>
		</>
	);
};

export { SignUpForm };
