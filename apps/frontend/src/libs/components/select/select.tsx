import React, { useCallback, useId } from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { Icon } from "~/libs/components/icon/icon.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	descriptionId?: string;
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
	descriptionId,
	isDisabled = false,
	label,
	name,
	options,
	placeholder,
	size = ControlSize.MD,
}: Properties<T>): React.JSX.Element => {
	const {
		field: { onChange, ...restField },
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
	const describedById =
		descriptionId ?? (errorMessage === undefined ? undefined : errorMessageId);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>): void => {
			const stringValue = event.target.value;

			const selectedOption = options.find(
				(option) => String(option.value) === stringValue,
			);

			onChange(selectedOption ? selectedOption.value : stringValue);
		},
		[onChange, options],
	);

	return (
		<div className={styles["field"]}>
			<label className={styles["label"]} htmlFor={selectId}>
				{label}
			</label>
			<div className={styles["control"]}>
				<select
					{...restField}
					aria-describedby={describedById}
					aria-invalid={hasError || undefined}
					className={getValidClasses(
						styles["select"],
						styles[size],
						hasError && styles["error"],
					)}
					id={selectId}
					onChange={handleChange}
					value={restField.value ?? ""}
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
				<Icon className={styles["icon"]} iconName={IconName.CHEVRON} />
			</div>
			{!descriptionId && (
				<span className={styles["message"]} id={errorMessageId}>
					{errorMessage}
				</span>
			)}
		</div>
	);
};

export { Select };
