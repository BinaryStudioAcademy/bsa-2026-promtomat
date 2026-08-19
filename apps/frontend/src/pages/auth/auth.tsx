import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { useSignUpMutation } from "~/modules/auth/auth-api.js";
import { type UserSignUpRequestDto } from "~/modules/users/users.js";

import { SignInForm } from "./components/sign-in-form/sign-in-form.js";
import { SignUpForm } from "./components/sign-up-form/sign-up-form.js";

const Auth: React.FC = () => {
	const { pathname } = useLocation();
	const [signUp, { error, isLoading }] = useSignUpMutation();

	const handleSignInSubmit = useCallback((): void => {
		// handle sign in
	}, []);

	const handleSignUpSubmit = useCallback(
		(payload: UserSignUpRequestDto): void => {
			void signUp(payload);
		},
		[signUp],
	);

	const getScreen = (screen: string): React.JSX.Element => {
		if (screen === AppRoute.SIGN_UP) {
			return <SignUpForm onSubmit={handleSignUpSubmit} />;
		}

		return <SignInForm onSubmit={handleSignInSubmit} />;
	};

	return (
		<>
			{isLoading && <p>Loading...</p>}
			{isServerError(error) && <p>{error.message}</p>}
			{getScreen(pathname)}
		</>
	);
};

export { Auth };
