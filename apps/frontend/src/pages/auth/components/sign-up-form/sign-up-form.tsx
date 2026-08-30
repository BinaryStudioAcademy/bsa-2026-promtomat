import { useCallback, useEffect, useId, useState } from "react";
import { useFormState, useWatch } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { Link } from "~/libs/components/link/link.js";
import { AppRoute, ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import {
	type SignUpRequestDto,
	signUpValidationSchema,
} from "~/modules/auth/auth.js";

import styles from "../../styles.module.css";
import { FormAlert } from "../form-alert/form-alert.js";
import { PasswordRules } from "../password-rules/password-rules.js";
import {
	DEFAULT_SIGN_UP_PAYLOAD,
	SIGN_UP_SUCCESS_MESSAGE,
} from "./libs/constants.js";

type Properties = {
	errorMessage: null | string;
	hasConflictError: boolean;
	isLoading: boolean;
	isSuccess: boolean;
	onSubmit: (payload: SignUpRequestDto) => void;
};

const SignUpForm: React.FC<Properties> = ({
	errorMessage,
	hasConflictError,
	isLoading,
	isSuccess,
	onSubmit,
}: Properties) => {
	const isDisabled = isLoading || isSuccess;
	const { control, errors, handleSubmit, setError } =
		useAppForm<SignUpRequestDto>({
			defaultValues: DEFAULT_SIGN_UP_PAYLOAD,
			isDisabled,
			mode: "onTouched",
			validationSchema: signUpValidationSchema,
		});

	const passwordRulesId = useId();
	const [hasPasswordBeenFocused, setHasPasswordBeenFocused] = useState(false);
	const password = useWatch({ control, name: "password" });
	const { isSubmitted } = useFormState({ control });

	const handlePasswordFocus = useCallback((): void => {
		setHasPasswordBeenFocused(true);
	}, []);

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(onSubmit)(event_);
		},
		[handleSubmit, onSubmit],
	);

	useEffect(() => {
		if (hasConflictError) {
			setError("email", { type: "server" });
		}
	}, [hasConflictError, setError]);

	return (
		<>
			<h1 className={styles["heading"]}>Sign up</h1>
			{errorMessage && <FormAlert message={errorMessage} />}
			{isSuccess ? (
				<FormAlert message={SIGN_UP_SUCCESS_MESSAGE} variant="success" />
			) : null}
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<div className={styles["input-wrapper"]}>
					<Input
						control={control}
						errors={errors}
						label="Email"
						name="email"
						placeholder="Enter your email"
						type="email"
					/>
					<div
						className={styles["password-field"]}
						onFocus={handlePasswordFocus}
					>
						<Input
							control={control}
							descriptionId={passwordRulesId}
							errors={errors}
							label="Password"
							name="password"
							placeholder="Enter your password"
							type="password"
						/>
						{(hasPasswordBeenFocused || isSubmitted) && (
							<PasswordRules
								id={passwordRulesId}
								isSubmitted={isSubmitted}
								password={password}
							/>
						)}
					</div>
				</div>
				<Button
					isDisabled={isDisabled}
					label="Create Developer Account"
					size={ControlSize.LG}
					type="submit"
				/>
			</form>
			<p className={styles["footer"]}>
				Already have an account? <Link to={AppRoute.SIGN_IN}>Sign in</Link>
			</p>
		</>
	);
};

export { SignUpForm };
