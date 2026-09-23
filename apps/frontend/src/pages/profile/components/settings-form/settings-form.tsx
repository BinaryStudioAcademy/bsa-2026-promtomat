import { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { Select } from "~/libs/components/select/select.js";
import { ControlSize, ErrorCode } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { ValueOf } from "~/libs/types/types.js";
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
import {
	SettingsDescriptionMessage,
	SettingsMessage,
} from "../../libs/enums/enums.js";
import {
	checkHasSettingsChanged,
	getSettingsFormValues,
} from "../../libs/helpers/helpers.js";
import { type SettingsFormValues } from "../../libs/types/types.js";
import { Section } from "../section/section.js";
import { UserInfo } from "../user-info/user-info.js";
import styles from "./styles.module.css";

type Properties = {
	user: UserDto & { totalPrompts: number };
};

const SettingsForm: React.FC<Properties> = ({ user }: Properties) => {
	const [updateProfile, { isLoading }] = useUpdateProfileMutation();
	const {
		control,
		formState: { isDirty },
		handleSubmit,
		reset,
		setError,
		setValue,
	} = useAppForm<SettingsFormValues>({
		defaultValues: getSettingsFormValues(user),
		validationSchema: updateProfileValidationSchema,
	});
	const [message, setMessage] = useState<
		ValueOf<typeof SettingsDescriptionMessage>
	>(SettingsDescriptionMessage.DEFAULT);

	const isSaveDisabled = isLoading || !isDirty;

	const handleNicknameBlur = useCallback(
		(event: React.FocusEvent<HTMLInputElement>): void => {
			setValue("nickname", event.target.value.trim(), { shouldDirty: true });
		},
		[setValue],
	);

	const handleSave = useCallback(
		(payload: SettingsFormValues): void => {
			const hasPayloadChanged = checkHasSettingsChanged({
				current: getSettingsFormValues(user),
				next: payload,
			});

			if (
				!hasPayloadChanged ||
				payload.primaryAiCodingTool === EMPTY_AI_CODING_TOOL
			) {
				return;
			}

			void updateProfile({
				nickname: payload.nickname,
				primaryAiCodingTool: payload.primaryAiCodingTool,
			})
				.unwrap()
				.then((updatedUser: UserDto) => {
					reset(getSettingsFormValues(updatedUser));
					showNotification({
						message: SettingsMessage.SUCCESS,
						type: NotificationType.SUCCESS,
					});
					setMessage(SettingsDescriptionMessage.SAVED);
				})
				.catch((caughtError: unknown) => {
					if (
						isServerError(caughtError) &&
						caughtError.code === ErrorCode.AUTH_NICKNAME_ALREADY_EXISTS
					) {
						setError("nickname", {
							message: caughtError.message,
							type: "server",
						});
					}
				});
		},
		[reset, setError, updateProfile, user],
	);

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(handleSave)(event_);
		},
		[handleSave, handleSubmit],
	);

	return (
		<Section title="PROFILE">
			<UserInfo user={user} />
			<form className={styles["form"]} noValidate onSubmit={handleFormSubmit}>
				<div className={styles["fields"]}>
					<Input
						control={control}
						label="Nickname"
						maxLength={AuthValidationRule.NICKNAME_MAXIMUM_LENGTH}
						name="nickname"
						onBlur={handleNicknameBlur}
						placeholder={SettingsMessage.NICKNAME_PLACEHOLDER}
						size={ControlSize.LG}
					/>
					<Select
						control={control}
						iconName="code"
						label="Primary AI coding tool"
						name="primaryAiCodingTool"
						options={AI_CODING_TOOL_OPTIONS}
						placeholder={SettingsMessage.TOOL_PLACEHOLDER}
						size={ControlSize.LG}
					/>
				</div>
				<div className={styles["profile-save-row"]}>
					<Button
						isDisabled={isSaveDisabled}
						isLoading={isLoading}
						label={isLoading ? SettingsMessage.SAVING : SettingsMessage.SAVE}
						size={ControlSize.LG}
						type="submit"
					/>
					<span className={styles["small"]}>
						{isDirty ? SettingsDescriptionMessage.DEFAULT : message}
					</span>
				</div>
			</form>
		</Section>
	);
};

export { SettingsForm };
