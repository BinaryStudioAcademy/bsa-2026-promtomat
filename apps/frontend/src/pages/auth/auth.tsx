import { useCallback, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { Logo } from "~/libs/components/logo/logo.js";
import { AppRoute, ControlSize, HTTPCode } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import {
	useGetAuthenticatedUserQuery,
	useSignUpMutation,
} from "~/modules/auth/auth-api.js";
import { type SignUpRequestDto } from "~/modules/auth/auth.js";

import { PromptShowcase } from "./components/prompt-showcase/prompt-showcase.js";
import { SignInForm } from "./components/sign-in-form/sign-in-form.js";
import { SignUpForm } from "./components/sign-up-form/sign-up-form.js";
import styles from "./styles.module.css";

const Auth: React.FC = () => {
	const { pathname } = useLocation();
	const [signUp, { error, isLoading, isSuccess, reset }] = useSignUpMutation();
	const { data: user, isLoading: isAuthLoading } =
		useGetAuthenticatedUserQuery(undefined);

	const errorMessage = isServerError(error) ? error.message : null;
	const hasConflictError =
		isServerError(error) && error.status === HTTPCode.CONFLICT;

	useEffect(() => {
		if (pathname !== AppRoute.SIGN_UP) {
			reset();
		}
	}, [pathname, reset]);

	const handleSignInSubmit = useCallback((): void => {
		// handle sign in
	}, []);

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
		return <Navigate replace to={AppRoute.ROOT} />;
	}

	const getScreen = (screen: string): React.JSX.Element => {
		if (screen === AppRoute.SIGN_UP) {
			return (
				<SignUpForm
					errorMessage={errorMessage}
					hasConflictError={hasConflictError}
					isLoading={isLoading}
					isSuccess={isSuccess}
					onSubmit={handleSignUpSubmit}
				/>
			);
		}

		return <SignInForm onSubmit={handleSignInSubmit} />;
	};

	return (
		<main className={styles["page"]}>
			<div className={getValidClasses("page-container", styles["container"])}>
				<section
					aria-labelledby="auth-intro-heading"
					className={styles["panel"]}
				>
					<div className={styles["intro"]}>
						<Logo size={ControlSize.MD} />

						<div className={styles["intro-copy"]}>
							<h2 className={styles["headline"]} id="auth-intro-heading">
								Find the prompt that already works.
							</h2>

							<p className={styles["tablet-description"]}>
								Search, score and reuse prompts across your AI coding tools.
							</p>

							<p className={styles["desktop-description"]}>
								Search, score and reuse prompts across your AI coding tools —
								instead of writing the same one twice.
							</p>
						</div>
						<PromptShowcase />
					</div>
				</section>
				<div className={styles["form-side"]}>
					<div className={styles["card"]}>
						<div className={styles["mobile-logo"]}>
							<Logo size={ControlSize.SM} />
						</div>

						{getScreen(pathname)}
					</div>
				</div>
			</div>
		</main>
	);
};

export { Auth };
