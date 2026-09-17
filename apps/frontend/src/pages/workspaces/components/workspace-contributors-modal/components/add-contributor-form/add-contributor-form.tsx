import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { Input } from "~/libs/components/input/input.js";
import {
	ControlSize,
	FormValidationMode,
	IconName,
} from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { getErrorMessage } from "~/libs/modules/api/libs/helpers/get-error-message.helper.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { type WorkspaceAddContributorRequestDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useAddWorkspaceContributorMutation,
	workspaceAddContributorValidationSchema,
} from "~/modules/workspaces/workspaces.js";

import { EMAIL_ERROR_CODES } from "./libs/constants/constants.js";
import { AddContributorFormMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	workspaceId: number;
};

const AddContributorForm: React.FC<Properties> = ({
	workspaceId,
}: Properties) => {
	const [addContributor, { error, isLoading }] =
		useAddWorkspaceContributorMutation();
	const { control, handleSubmit, reset, setError } =
		useAppForm<WorkspaceAddContributorRequestDto>({
			defaultValues: { email: "" },
			mode: FormValidationMode.ON_TOUCHED,
			validationSchema: workspaceAddContributorValidationSchema,
		});

	const isEmailError =
		isServerError(error) && EMAIL_ERROR_CODES.has(error.code);
	const generalErrorMessage = isEmailError ? null : getErrorMessage(error);

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(async (payload: WorkspaceAddContributorRequestDto) => {
				const result = await addContributor({ payload, workspaceId });

				if (result.data) {
					reset();
				}

				if (
					isServerError(result.error) &&
					EMAIL_ERROR_CODES.has(result.error.code)
				) {
					setError("email", { message: result.error.message, type: "server" });
				}
			})(event);
		},
		[addContributor, handleSubmit, reset, setError, workspaceId],
	);

	return (
		<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
			{generalErrorMessage && <FormAlert message={generalErrorMessage} />}

			<div className={styles["row"]}>
				<Input
					control={control}
					isLabelHidden
					label="Email address"
					name="email"
					placeholder={AddContributorFormMessage.EMAIL_PLACEHOLDER}
				/>
				<Button
					iconName={IconName.PLUS}
					isLoading={isLoading}
					label="Add"
					size={ControlSize.MD}
					type="submit"
				/>
			</div>

			<p className={styles["note"]}>
				<Icon className={styles["note-icon"]} iconName={IconName.INFO} />
				{AddContributorFormMessage.NO_ACCOUNT_HINT}
			</p>
		</form>
	);
};

export { AddContributorForm };
