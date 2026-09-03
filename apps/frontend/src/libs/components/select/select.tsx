import React, { useId } from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type SelectOption } from "./libs/types/types.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	isDisabled?: boolean;
	isRequired?: boolean;
	label: string;
	name: FieldPath<T>;
	options: SelectOption[];
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
};

const Select = <T extends FieldValues>({
	control,
	isDisabled = false,
	isRequired = false,
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

	const errorMessageId = useId();
	const selectId = useId();
	const hasError = Boolean(error);
	const errorMessage = error?.message;
	const describedById = errorMessage === undefined ? undefined : errorMessageId;

	return (
		<div className={styles["field"]}>
			<label className={styles["label"]} htmlFor={selectId}>
				{label}
				{isRequired ? (
					<span aria-hidden="true" className={styles["required"]}>
						*
					</span>
				) : null}
			</label>
			<div className={styles["control"]}>
				<select
					{...field}
					aria-describedby={describedById}
					aria-invalid={hasError || undefined}
					aria-required={isRequired || undefined}
					className={getValidClasses(
						styles["select"],
						styles[size],
						hasError && styles["error"],
					)}
					id={selectId}
				>
					{placeholder === undefined ? null : (
						<option disabled value="">
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
			<span className={styles["message"]} id={errorMessageId}>
				{errorMessage}
			</span>
		</div>
	);
};

export { Select };
