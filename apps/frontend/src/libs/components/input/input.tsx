import React, { useCallback, useId, useState } from "react";
import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	autoComplete?: React.HTMLInputAutoCompleteAttribute;
	control: Control<T, null>;
	descriptionId?: string;
	errors: FieldErrors<T>;
	isDisabled?: boolean;
	label: string;
	name: FieldPath<T>;
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
	type?: "email" | "password" | "text";
};

const Input = <T extends FieldValues>({
	autoComplete,
	control,
	descriptionId,
	errors,
	isDisabled = false,
	label,
	name,
	placeholder = "",
	size = ControlSize.MD,
	type = "text",
}: Properties<T>): React.JSX.Element => {
	const { field } = useController({
		control,
		disabled: isDisabled,
		name: name,
	});

	const errorMessageId = useId();
	const fieldError = errors[name];
	const hasError = fieldError !== undefined;
	const errorMessage = fieldError?.message;
	const describedById =
		descriptionId ?? (errorMessage === undefined ? undefined : errorMessageId);
	const inputId = useId();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const isPasswordField = type === "password";
	const inputType = isPasswordField && isPasswordVisible ? "text" : type;

	const handleVisibilityToggle = useCallback((): void => {
		setIsPasswordVisible((previous) => !previous);
	}, []);

	return (
		<div className={styles["field"]}>
			<label className={styles["label"]} htmlFor={inputId}>
				{label}
			</label>
			<div className={styles["control"]}>
				<input
					{...field}
					aria-describedby={describedById}
					aria-invalid={hasError || undefined}
					autoComplete={autoComplete}
					className={getValidClasses(
						styles["input"],
						styles[size],
						hasError && styles["error"],
						isPasswordField && styles["with-toggle"],
					)}
					id={inputId}
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
						<svg
							aria-hidden="true"
							className={getValidClasses(
								styles["toggle-icon"],
								!isPasswordVisible && styles["toggle-icon-filled"],
							)}
							viewBox="0 0 16 16"
						>
							<path d="M1 8s2.5-4.5 7-4.5 7 4.5 7 4.5-2.5 4.5-7 4.5S1 8 1 8Z" />
							<circle className={styles["pupil"]} cx="8" cy="8" r="2" />
						</svg>
					</button>
				)}
			</div>
			{descriptionId === undefined && (
				<span className={styles["message"]} id={errorMessageId}>
					{hasError && (errorMessage as string)}
				</span>
			)}
		</div>
	);
};

export { Input };
