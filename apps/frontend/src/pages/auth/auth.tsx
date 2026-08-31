import { useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import {
	useGetAuthenticatedUserQuery,
	useSignUpMutation,
} from "~/modules/auth/auth-api.js";
import { type SignUpRequestDto } from "~/modules/auth/auth.js";

import { SignInForm } from "./components/sign-in-form/sign-in-form.js";
import { SignUpForm } from "./components/sign-up-form/sign-up-form.js";
import styles from "./styles.module.css";

const Auth: React.FC = () => {
	const { pathname } = useLocation();
	const [signUp, { isLoading }] = useSignUpMutation();
	const { data: user, isLoading: isAuthLoading } =
		useGetAuthenticatedUserQuery(undefined);

	const handleSignUpSubmit = useCallback(
		(payload: SignUpRequestDto): void => {
			void signUp(payload);
		},
		[signUp],
	);

	if (isAuthLoading) {
		return <p>Loading...</p>;
	}

	if (user) {
		return <Navigate to={AppRoute.ROOT} />;
	}

	const getScreen = (screen: string): React.JSX.Element => {
		if (screen === AppRoute.SIGN_UP) {
			return <SignUpForm isLoading={isLoading} onSubmit={handleSignUpSubmit} />;
		}

		return <SignInForm />;
	};

	return (
		<main className={styles["container"]}>
			<div className={styles["card"]}>{getScreen(pathname)}</div>
		</main>
	);
};

export { Auth };
