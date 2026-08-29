import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AppRoute, HTTPCode } from "~/libs/enums/enums.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { useSignUpMutation } from "~/modules/auth/auth-api.js";
import { type SignUpRequestDto } from "~/modules/auth/auth.js";

import { SignInForm } from "./components/sign-in-form/sign-in-form.js";
import { SignUpForm } from "./components/sign-up-form/sign-up-form.js";
import styles from "./styles.module.css";

const Auth: React.FC = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [signUp, { error, isLoading }] = useSignUpMutation();

	const errorMessage = isServerError(error) ? error.message : null;
	const hasConflictError =
		isServerError(error) && error.status === HTTPCode.CONFLICT;

	const handleSignInSubmit = useCallback((): void => {
		// handle sign in
	}, []);

	const handleSignUpSubmit = useCallback(
		async (payload: SignUpRequestDto): Promise<void> => {
			try {
				await signUp(payload).unwrap();
				await navigate(AppRoute.ROOT, { replace: true });
			} catch {
				// No navigation on failure: the user stays on the form, where the mutation error is already shown
			}
		},
		[signUp, navigate],
	);

	const getScreen = (screen: string): React.JSX.Element => {
		if (screen === AppRoute.SIGN_UP) {
			return (
				<SignUpForm
					errorMessage={errorMessage}
					hasConflictError={hasConflictError}
					isLoading={isLoading}
					onSubmit={handleSignUpSubmit}
				/>
			);
		}

		return <SignInForm onSubmit={handleSignInSubmit} />;
	};

	return (
		<main className={styles["container"]}>
			<div className={styles["card"]}>
				{isLoading && <p>Loading...</p>}
				{getScreen(pathname)}
			</div>
		</main>
	);
};

export { Auth };
