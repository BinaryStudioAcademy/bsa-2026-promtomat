import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { useSignUpMutation } from "~/modules/auth/auth-api.js";
import { type SignUpRequestDto } from "~/modules/auth/auth.js";

import { SignInForm } from "./components/sign-in-form/sign-in-form.js";
import { SignUpForm } from "./components/sign-up-form/sign-up-form.js";

const Auth: React.FC = () => {
	const { pathname } = useLocation();
	const [signUp, { error, isLoading }] = useSignUpMutation();

	const errorMessage = isServerError(error) ? error.message : null;

	const handleSignInSubmit = useCallback((): void => {
		// handle sign in
	}, []);

	const handleSignUpSubmit = useCallback(
		(payload: SignUpRequestDto): void => {
			void signUp(payload);
		},
		[signUp],
	);

	const getScreen = (screen: string): React.JSX.Element => {
		if (screen === AppRoute.SIGN_UP) {
			return (
				<SignUpForm
					errorMessage={errorMessage}
					isLoading={isLoading}
					onSubmit={handleSignUpSubmit}
				/>
			);
		}

		return <SignInForm onSubmit={handleSignInSubmit} />;
	};

	return (
		<>
			{isLoading && <p>Loading...</p>}
			{getScreen(pathname)}
		</>
	);
};

export { Auth };
