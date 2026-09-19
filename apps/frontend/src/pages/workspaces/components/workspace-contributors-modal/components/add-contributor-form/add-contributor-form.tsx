import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { Input } from "~/libs/components/input/input.js";
import {
	ControlSize,
	FormValidationMode,
	IconName,
} from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { type WorkspaceAddContributorRequestDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useAddWorkspaceContributorMutation,
	workspaceAddContributorValidationSchema,
} from "~/modules/workspaces/workspaces.js";

import { EMAIL_OR_NICKNAME_ERROR_CODES } from "./libs/constants/constants.js";
import { AddContributorFormMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	workspaceId: number;
};

const AddContributorForm: React.FC<Properties> = ({
	workspaceId,
}: Properties) => {
	const [addContributor, { isLoading }] = useAddWorkspaceContributorMutation();
	const { control, handleSubmit, reset, setError } =
		useAppForm<WorkspaceAddContributorRequestDto>({
			defaultValues: { emailOrNickname: "" },
			mode: FormValidationMode.ON_TOUCHED,
			validationSchema: workspaceAddContributorValidationSchema,
		});

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(async (payload: WorkspaceAddContributorRequestDto) => {
				const result = await addContributor({ payload, workspaceId });

				if (result.data) {
					reset();
				}

				if (
					isServerError(result.error) &&
					EMAIL_OR_NICKNAME_ERROR_CODES.has(result.error.code)
				) {
					setError("emailOrNickname", {
						message: result.error.message,
						type: "server",
					});
				}
			})(event);
		},
		[addContributor, handleSubmit, reset, setError, workspaceId],
	);

	return (
		<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
			<div className={styles["row"]}>
				<Input
					control={control}
					isLabelHidden
					label="Email or nickname"
					name="emailOrNickname"

					placeholder={AddContributorFormMessage.EMAIL_OR_NICKNAME_PLACEHOLDER}
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
