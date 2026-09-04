import React, { useCallback, useId, useState } from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { Icon } from "~/libs/components/icon/icon.js";
import { ControlSize, IconName, InputType } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	autoComplete?: React.HTMLInputAutoCompleteAttribute;
	control: Control<T, null>;
	descriptionId?: string;
	isDisabled?: boolean;
	isRequired?: boolean;
	label: string;
	maxLength?: number;
	name: FieldPath<T>;
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
	type?: ValueOf<typeof InputType>;
};

const Input = <T extends FieldValues>({
	autoComplete,
	control,
	descriptionId,
	isDisabled = false,
	isRequired = false,
	label,
	maxLength,
	name,
	onFocus,
	placeholder = "",
	size = ControlSize.MD,
	type = InputType.TEXT,
}: Properties<T>): React.JSX.Element => {
	const {
		field,
		fieldState: { error },
	} = useController({
		control,
		disabled: isDisabled,
		name,
	});

	const errorMessageId = useId();
	const inputId = useId();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const hasError = Boolean(error);
	const errorMessage = error?.message;
	const describedById =
		descriptionId ?? (errorMessage === undefined ? undefined : errorMessageId);

	const isPasswordField = type === InputType.PASSWORD;
	const inputType =
		isPasswordField && isPasswordVisible ? InputType.TEXT : type;

	const handleVisibilityToggle = useCallback((): void => {
		setIsPasswordVisible((previous) => !previous);
	}, []);

	return (
		<div className={styles["field"]}>
			<label className={styles["label"]} htmlFor={inputId}>
				{label}
				{isRequired ? (
					<span aria-hidden="true" className={styles["required"]}>
						*
					</span>
				) : null}
			</label>
			<div className={styles["control"]}>
				<input
					{...field}
					aria-describedby={describedById}
					aria-invalid={hasError || undefined}
					aria-required={isRequired || undefined}
					autoComplete={autoComplete}
					className={getValidClasses(
						styles["input"],
						styles[size],
						hasError && styles["error"],
						isPasswordField && styles["with-toggle"],
					)}
					id={inputId}
					maxLength={maxLength}
					onFocus={onFocus}
					placeholder={placeholder}
					type={inputType}
				/>
				{isPasswordField && (
					<button
						aria-label={isPasswordVisible ? "Hide password" : "Show password"}
						aria-pressed={isPasswordVisible}
						className={styles["toggle"]}
						disabled={field.disabled}
						onClick={handleVisibilityToggle}
						type="button"
					>
						<Icon
							className={styles["toggle-icon"]}
							iconName={isPasswordVisible ? IconName.EYE_FILLED : IconName.EYE}
						/>
					</button>
				)}
			</div>
			{!descriptionId && (
				<span className={styles["message"]} id={errorMessageId}>
					{errorMessage}
				</span>
			)}
		</div>
	);
};

export { Input };
