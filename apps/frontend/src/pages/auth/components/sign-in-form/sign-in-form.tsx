import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useSignInMutation } from "~/modules/auth/auth-api.js";
import {
	type SignInRequestDto,
	signInValidationSchema,
} from "~/modules/auth/auth.js";

import { DEFAULT_SIGN_IN_PAYLOAD } from "./libs/constants.js";

const SignInForm: React.FC = () => {
	const [signIn, { isLoading }] = useSignInMutation();

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

	return (
		<>
			<h1>Sign In</h1>
			<form onSubmit={handleFormSubmit}>
				<p>
					<Input
						control={control}
						errors={errors}
						label="Email"
						name="email"
						placeholder="Enter your email"
						type="email"
					/>
				</p>
				<p>
					<Input
						control={control}
						errors={errors}
						label="Password"
						name="password"
						placeholder="Enter your password"
						type="password"
					/>
				</p>
				<Button isDisabled={isLoading} label="Sign in" type="submit" />
			</form>
		</>
	);
};

export { SignInForm };
