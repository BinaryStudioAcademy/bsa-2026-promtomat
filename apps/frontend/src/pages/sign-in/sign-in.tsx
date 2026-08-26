import { QueryStatus } from "@reduxjs/toolkit/query";
import { useCallback } from "react";
import { Navigate } from "react-router-dom";

import { AppRoute } from "~/libs/enums/app-route.enum.js";
import { useSignInMutation } from "~/modules/auth/auth-api.js";
import { type SignInRequestDto } from "~/modules/auth/auth.js";

import { SignInForm } from "./components/sign-in-form/sign-in-form.js";

const SignIn: React.FC = () => {
	const [signIn, { isLoading, status }] = useSignInMutation();

	const handleSignInSubmit = useCallback(
		(payload: SignInRequestDto): void => void signIn(payload),
		[signIn],
	);

	return (
		<>
			<SignInForm isLoading={isLoading} onSubmit={handleSignInSubmit} />
			{status === QueryStatus.fulfilled && (
				<Navigate replace to={AppRoute.ROOT} />
			)}
		</>
	);
};

export { SignIn };
