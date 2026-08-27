import React from "react";
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

import styles from "./input.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	errors: FieldErrors<T>;
	isDisabled?: boolean;
	label: string;
	name: FieldPath<T>;
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
	type?: "email" | "text";
};

const Input = <T extends FieldValues>({
	control,
	errors,
	isDisabled = false,
	label,
	name,
	placeholder = "",
	size = "md",
	type = "text",
}: Properties<T>): React.JSX.Element => {
	const { field } = useController({ control, name });

	const error = errors[name]?.message;
	const hasError = Boolean(error);

	return (
		<label className={styles["field"]}>
			<span className={styles["label"]}>{label}</span>
			<input
				{...field}
				className={getValidClasses(
					styles["input"],
					styles[size],
					hasError && styles["error"],
				)}
				disabled={isDisabled}
				placeholder={placeholder}
				type={type}
			/>
			{hasError && <span className={styles["message"]}>{error as string}</span>}
		</label>
	);
};

export { Input };
