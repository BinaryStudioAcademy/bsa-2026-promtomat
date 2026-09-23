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
	className?: string | undefined;
	control: Control<T, null>;
	descriptionId?: string | undefined;
	isDisabled?: boolean;
	isLabelHidden?: boolean;
	isRequired?: boolean;
	label: string;
	maxLength?: number;
	name: FieldPath<T>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onClick?: React.MouseEventHandler<HTMLInputElement>;
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	placeholder?: string;
	ref?: React.Ref<HTMLInputElement>;
	size?: ValueOf<typeof ControlSize>;
	type?: ValueOf<typeof InputType>;
};

const Input = <T extends FieldValues>({
	autoComplete,
	className = "",
	control,
	descriptionId,
	isDisabled = false,
	isLabelHidden = false,
	isRequired = false,
	label,
	maxLength,
	name,
	onBlur,
	onClick,
	onFocus,
	onKeyDown,
	placeholder = "",
	ref,
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
	const iconName = isPasswordVisible ? IconName.EYE_FILLED : IconName.EYE;
	const buttonAriaLabel = isPasswordVisible ? "Hide password" : "Show password";

	const handleVisibilityToggle = useCallback((): void => {
		setIsPasswordVisible((previous) => !previous);
	}, []);

	const handleBlur = useCallback(
		(event: React.FocusEvent<HTMLInputElement>): void => {
			field.onBlur();
			onBlur?.(event);
		},
		[field, onBlur],
	);

	return (
		<div className={styles["field"]}>
			<label
				className={getValidClasses(
					styles["label"],
					isLabelHidden && "visually-hidden",
				)}
				htmlFor={inputId}
			>
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
					aria-invalid={hasError}
					aria-required={isRequired || undefined}
					autoComplete={autoComplete}
					className={getValidClasses(
						styles["input"],
						styles[size],
						hasError && styles["error"],
						isPasswordField && styles["with-toggle"],
						className,
					)}
					id={inputId}
					maxLength={maxLength}
					onBlur={handleBlur}
					onClick={onClick}
					onFocus={onFocus}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					ref={ref}
					type={inputType}
				/>
				{isPasswordField && (
					<button
						aria-label={buttonAriaLabel}
						aria-pressed={isPasswordVisible}
						className={styles["toggle"]}
						disabled={field.disabled}
						onClick={handleVisibilityToggle}
						type="button"
					>
						<Icon className={styles["toggle-icon"]} iconName={iconName} />
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
