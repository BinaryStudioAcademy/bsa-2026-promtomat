import { useCallback } from "react";
import { Navigate } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { Link } from "~/libs/components/link/link.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useSignInMutation } from "~/modules/auth/auth-api.js";
import {
	type SignInRequestDto,
	signInValidationSchema,
} from "~/modules/auth/auth.js";

import styles from "../../styles.module.css";
import { DEFAULT_SIGN_IN_PAYLOAD } from "./libs/constants.js";

const SignInForm: React.FC = () => {
	const [signIn, { data, isError, isLoading }] = useSignInMutation();

	const { control, errors, handleSubmit } = useAppForm<SignInRequestDto>({
		defaultValues: DEFAULT_SIGN_IN_PAYLOAD,
		validationSchema: signInValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit((payload: SignInRequestDto) => void signIn(payload))(
				event_,
			);
		},
		[handleSubmit, signIn],
	);

	if (!isError && Boolean(data?.user)) {
		return <Navigate replace to={AppRoute.ROOT} />;
	}

	return (
		<>
			<h1 className={styles["heading"]}>Sign In</h1>
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
				<Button isDisabled={isLoading} label="Sign in" type="submit" />
			</form>
			<p className={styles["footer"]}>
				Don&apos;t have an account? <Link to={AppRoute.SIGN_UP}>Sign up</Link>
			</p>
		</>
	);
};

export { SignInForm };
