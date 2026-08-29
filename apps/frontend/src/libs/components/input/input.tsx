import React, { useId } from "react";
import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { type ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	descriptionId?: string;
	errors: FieldErrors<T>;
	isDisabled?: boolean;
	label: string;
	name: Extract<keyof T, string>;
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
	type?: "email" | "password" | "text";
};

const Input = <T extends FieldValues>({
	control,
	descriptionId,
	errors,
	isDisabled = false,
	label,
	name,
	placeholder = "",
	size = "md",
	type = "text",
}: Properties<T>): React.JSX.Element => {
	const { field } = useController({
		control,
		disabled: isDisabled,
		name: name as unknown as FieldPath<T>,
	});

	const errorMessageId = useId();
	const fieldError = errors[name];
	const hasError = fieldError !== undefined;
	const errorMessage = fieldError?.message;
	const describedById =
		descriptionId ?? (errorMessage === undefined ? undefined : errorMessageId);

	return (
		<label className={styles["field"]}>
			<span className={styles["label"]}>{label}</span>
			<input
				{...field}
				aria-describedby={describedById}
				aria-invalid={hasError || undefined}
				className={getValidClasses(
					styles["input"],
					styles[size],
					hasError && styles["error"],
				)}
				placeholder={placeholder}
				type={type}
			/>
			{errorMessage !== undefined && descriptionId === undefined && (
				<span className={styles["message"]} id={errorMessageId}>
					{errorMessage as string}
				</span>
			)}
		</label>
	);
};

export { Input };
