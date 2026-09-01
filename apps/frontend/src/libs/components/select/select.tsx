import React from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	isDisabled?: boolean;
	label: string;
	name: FieldPath<T>;
	options: SelectOption[];
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
};

type SelectOption = {
	label: string;
	value: number | string;
};

const Select = <T extends FieldValues>({
	control,
	isDisabled = false,
	label,
	name,
	options,
	placeholder,
	size = ControlSize.MD,
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
			<div className={styles["selectWrapper"]}>
				<select
					{...field}
					className={getValidClasses(
						styles["select"],
						styles[size],
						hasError && styles["error"],
					)}
				>
					{placeholder && (
						<option disabled hidden value="">
							{placeholder}
						</option>
					)}
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
			{error ? (
				<span className={styles["message"]}>{error.message}</span>
			) : null}
		</label>
	);
};

export { Select };
