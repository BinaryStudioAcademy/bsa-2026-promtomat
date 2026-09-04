import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Input } from "~/libs/components/input/input.js";
import { Select } from "~/libs/components/select/select.js";
import { ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { AuthValidationRule } from "~/modules/auth/auth.js";
import { useUpdateProfileMutation } from "~/modules/users/users-api.js";
import {
	updateProfileValidationSchema,
	type UserDto,
} from "~/modules/users/users.js";

import {
	AI_CODING_TOOL_OPTIONS,
	EMPTY_AI_CODING_TOOL,
} from "../../libs/constants.js";
import { SettingsMessage } from "../../libs/enums/enums.js";
import { getSettingsFormValues } from "../../libs/helpers/helpers.js";
import { type SettingsFormValues } from "../../libs/types/types.js";
import styles from "../../styles.module.css";

type Properties = {
	user: UserDto;
};

const SettingsForm: React.FC<Properties> = ({ user }: Properties) => {
	const [updateProfile, { error, isLoading }] = useUpdateProfileMutation();
	const { control, handleSubmit, isDirty, reset } =
		useAppForm<SettingsFormValues>({
			defaultValues: getSettingsFormValues(user),
			validationSchema: updateProfileValidationSchema,
		});

	const isSaveDisabled = isLoading || !isDirty;

	const handleSave = useCallback(
		(payload: SettingsFormValues): void => {
			if (!isDirty || payload.primaryAiCodingTool === EMPTY_AI_CODING_TOOL) {
				return;
			}

			void updateProfile({
				nickname: payload.nickname,
				primaryAiCodingTool: payload.primaryAiCodingTool,
			})
				.unwrap()
				.then((updatedUser: UserDto) => {
					reset(getSettingsFormValues(updatedUser));
					showNotification({ message: SettingsMessage.SUCCESS });
				})
				.catch(() => {
					// The failure is exposed through the mutation error state.
				});
		},
		[isDirty, reset, updateProfile],
	);

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(handleSave)(event_);
		},
		[handleSave, handleSubmit],
	);

	return (
		<section className={styles["card"]}>
			<h2 className={styles["section-title"]}>PROFILE SETUP</h2>
			<FormAlert error={error} />
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<div className={styles["fields"]}>
					<Input
						control={control}
						isRequired
						label="Nickname"
						maxLength={AuthValidationRule.NICKNAME_MAXIMUM_LENGTH}
						name="nickname"
						size={ControlSize.LG}
					/>
					<Select
						control={control}
						isRequired
						label="Primary AI coding tool"
						name="primaryAiCodingTool"
						options={AI_CODING_TOOL_OPTIONS}
						placeholder={SettingsMessage.TOOL_PLACEHOLDER}
						size={ControlSize.LG}
					/>
				</div>
				<Button
					isDisabled={isSaveDisabled}
					isLoading={isLoading}
					label={SettingsMessage.SAVE}
					size={ControlSize.LG}
					type="submit"
				/>
			</form>
		</section>
	);
};

export { SettingsForm };
