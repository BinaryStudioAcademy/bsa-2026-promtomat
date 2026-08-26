import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import {
	type SignInRequestDto,
	signInValidationSchema,
} from "~/modules/auth/auth.js";

import { DEFAULT_SIGN_IN_PAYLOAD } from "./libs/constants.js";

type Properties = {
	isLoading: boolean;
	onSubmit: (payload: SignInRequestDto) => void;
};

const SignInForm: React.FC<Properties> = ({
	isLoading,
	onSubmit,
}: Properties) => {
	const { control, errors, handleSubmit } = useAppForm<SignInRequestDto>({
		defaultValues: DEFAULT_SIGN_IN_PAYLOAD,
		validationSchema: signInValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(onSubmit)(event_);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<>
			<h1>Sign In</h1>
			{isLoading && <p>Loading...</p>}
			<form onSubmit={handleFormSubmit}>
				<p>
					<Input
						control={control}
						errors={errors}
						label="Email"
						name="email"
						placeholder="Enter your email"
						type="text"
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
