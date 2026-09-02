import { useCallback } from "react";
import { Navigate } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { Link } from "~/libs/components/link/link.js";
import { AppRoute, ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useSignInMutation } from "~/modules/auth/auth-api.js";
import {
	type SignInRequestDto,
	signInValidationSchema,
} from "~/modules/auth/auth.js";

import styles from "../../styles.module.css";
import { FormAlert } from "../form-alert/form-alert.js";
import { DEFAULT_SIGN_IN_PAYLOAD } from "./libs/constants.js";

const SignInForm: React.FC = () => {
	const [signIn, { data, isError, isLoading }] = useSignInMutation();

	const { control, handleSubmit } = useAppForm<SignInRequestDto>({
		defaultValues: DEFAULT_SIGN_IN_PAYLOAD,
		validationSchema: signInValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit((payload: SignInRequestDto) => void signIn(payload))(
				event,
			);
		},
		[handleSubmit, signIn],
	);

	if (!isError && Boolean(data?.user)) {
		return <Navigate replace to={AppRoute.ROOT} />;
	}

	return (
		<>
			<h1 className={styles["heading"]}>Log into your account</h1>
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				{isError && (
					<FormAlert
						message={"Coundn't Sign In: email or password is not valid"}
					/>
				)}
				<div className={styles["input-wrapper"]}>
					<Input
						control={control}
						label="Email"
						name="email"
						placeholder="Enter your email"
						type="email"
					/>
					<Input
						control={control}
						label="Password"
						name="password"
						placeholder="Enter your password"
						type="password"
					/>
				</div>
				<Button
					isDisabled={isLoading}
					label="Sign in"
					size={ControlSize.LG}
					type="submit"
				/>
			</form>
			<p className={styles["footer"]}>
				Don&apos;t have an account? <Link to={AppRoute.SIGN_UP}>Sign up</Link>
			</p>
		</>
	);
};

export { SignInForm };
