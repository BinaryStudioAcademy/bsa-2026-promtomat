import { useCallback } from "react";

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
import { DEFAULT_SIGN_UP_PAYLOAD } from "./libs/constants.js";

type Properties = {
	errorMessage: null | string;
	isLoading: boolean;
	onSubmit: (payload: SignUpRequestDto) => Promise<void>;
};

const SignUpForm: React.FC<Properties> = ({
	errorMessage,
	isLoading,
	onSubmit,
}: Properties) => {
	const { control, errors, handleSubmit } = useAppForm<SignUpRequestDto>({
		defaultValues: DEFAULT_SIGN_UP_PAYLOAD,
		isDisabled: isLoading,
		validationSchema: signUpValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(onSubmit)(event_);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<>
			<h1 className={styles["heading"]}>Sign up</h1>
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
					<Input
						control={control}
						errors={errors}
						label="Password"
						name="password"
						placeholder="Enter your password"
						type="password"
					/>
				</div>
				{errorMessage && <p role="alert">{errorMessage}</p>}
				<Button
					isDisabled={isLoading}
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
