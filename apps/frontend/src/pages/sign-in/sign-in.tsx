import { useCallback } from "react";
import { Navigate } from "react-router-dom";

import { AppRoute } from "~/libs/enums/app-route.enum.js";
import { useSignInMutation } from "~/modules/auth/auth-api.js";
import { type SignInRequestDto } from "~/modules/auth/auth.js";

import { SignInForm } from "./components/sign-in-form/sign-in-form.js";

const SignIn: React.FC = () => {
	const [signIn, { data, isError, isLoading }] = useSignInMutation();

	const handleSignInSubmit = useCallback(
		(payload: SignInRequestDto): void => void signIn(payload),
		[signIn],
	);

	if (!isError && Boolean(data?.user)) {
		return <Navigate replace to={AppRoute.ROOT} />;
	}

	return <SignInForm isLoading={isLoading} onSubmit={handleSignInSubmit} />;
};

export { SignIn };
