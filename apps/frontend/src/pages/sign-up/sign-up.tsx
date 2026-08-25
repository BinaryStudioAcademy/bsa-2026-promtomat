import { useCallback } from "react";

import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { useSignUpMutation } from "~/modules/auth/auth-api.js";
import { type SignUpRequestDto } from "~/modules/auth/auth.js";

import { SignUpForm } from "./components/sign-up-form/sign-up-form.js";

const SignUp: React.FC = () => {
	const [signUp, { error, isLoading }] = useSignUpMutation();

	const handleSignUpSubmit = useCallback(
		(payload: SignUpRequestDto): void => {
			void signUp(payload);
		},
		[signUp],
	);

	return (
		<>
			{isLoading && <p>Loading...</p>}
			{isServerError(error) && <p>{error.message}</p>}
			<SignUpForm isLoading={isLoading} onSubmit={handleSignUpSubmit} />
		</>
	);
};

export { SignUp };
