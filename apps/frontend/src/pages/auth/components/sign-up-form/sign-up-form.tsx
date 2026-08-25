import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import {
	type SignUpRequestDto,
	signUpValidationSchema,
} from "~/modules/auth/auth.js";

import { DEFAULT_SIGN_UP_PAYLOAD } from "./libs/constants.js";

type Properties = {
	onSubmit: (payload: SignUpRequestDto) => void;
};

const SignUpForm: React.FC<Properties> = ({ onSubmit }: Properties) => {
	const { control, errors, handleSubmit } = useAppForm<SignUpRequestDto>({
		defaultValues: DEFAULT_SIGN_UP_PAYLOAD,
		validationSchema: signUpValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(onSubmit)(event_);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<>
			<h3>Sign Up</h3>
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
						type="text"
					/>
				</p>
				<Button label="Sign up" type="submit" />
			</form>
		</>
	);
};

export { SignUpForm };
