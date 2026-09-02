import { useCallback } from "react";
import { Navigate } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { Link } from "~/libs/components/link/link.js";
import { AppRoute, ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useServerFormErrors } from "~/libs/hooks/use-server-form-errors/use-server-form-errors.hook.js";
import { getErrorMessage } from "~/libs/modules/api/libs/helpers/get-error-message.helper.js";
import { useSignInMutation } from "~/modules/auth/auth-api.js";
import {
	type SignInRequestDto,
	signInValidationSchema,
} from "~/modules/auth/auth.js";

import styles from "../../styles.module.css";
import { FormAlert } from "../form-alert/form-alert.js";
import { DEFAULT_SIGN_IN_PAYLOAD, SIGN_IN_FIELDS } from "./libs/constants.js";

const SignInForm: React.FC = () => {
	const [signIn, { data, error, isError, isLoading }] = useSignInMutation();

	const { clearErrors, control, handleSubmit, setError } =
		useAppForm<SignInRequestDto>({
			defaultValues: DEFAULT_SIGN_IN_PAYLOAD,
			validationSchema: signInValidationSchema,
		});

	useServerFormErrors({
		clearErrors,
		error,
		fields: SIGN_IN_FIELDS,
		setError,
	});

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit((payload: SignInRequestDto) => void signIn(payload))(
				event,
			);
		},
		[handleSubmit, signIn],
	);

	if (!isError && Boolean(data?.user)) {
		return <Navigate replace to={AppRoute.ROOT} />;
	}

	const errorMessage = getErrorMessage(error);

	return (
		<>
			<h1 className={styles["heading"]}>Sign In</h1>
			{errorMessage && <FormAlert message={errorMessage} />}
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<div className={styles["input-wrapper"]}>
					<Input
						control={control}
						label="Email"
						name="email"
						placeholder="Enter your email"
						type="email"
					/>
					<Input
						control={control}
						label="Password"
						name="password"
						placeholder="Enter your password"
						type="password"
					/>
				</div>
				<Button
					isDisabled={isLoading}
					label="Sign in"
					size={ControlSize.LG}
					type="submit"
				/>
			</form>
			<p className={styles["footer"]}>
				Don&apos;t have an account? <Link to={AppRoute.SIGN_UP}>Sign up</Link>
			</p>
		</>
	);
};

export { SignInForm };
