import React from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { ControlSize, InputType } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	isDisabled?: boolean;
	label: string;
	name: FieldPath<T>;
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
	type?: ValueOf<typeof InputType>;
};

const Input = <T extends FieldValues>({
	control,
	isDisabled = false,
	label,
	name,
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
				placeholder={placeholder}
				type={type}
			/>
			{error ? (
				<span className={styles["message"]}>{error.message}</span>
			) : null}
		</label>
	);
};

export { Input };
