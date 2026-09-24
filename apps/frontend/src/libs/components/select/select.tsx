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

import { type SelectOption } from "./libs/types/types.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	descriptionId?: string;
	isDisabled?: boolean;
	isLabelHidden?: boolean;
	isRequired?: boolean;
	label: string;
	leadingIconName?: ValueOf<typeof IconName>;
	name: FieldPath<T>;
	options: SelectOption[];
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
};

const Select = <T extends FieldValues>({
	control,
	descriptionId,
	isDisabled = false,
	isLabelHidden = false,
	isRequired = false,
	label,
	leadingIconName,
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
	const describedById = descriptionId ?? errorMessage ?? errorMessageId;

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
			<label
				className={getValidClasses(
					styles["label"],
					isLabelHidden && "visually-hidden",
				)}
				htmlFor={selectId}
			>
				{label}
				{isRequired ? (
					<span aria-hidden="true" className={styles["required"]}>
						*
					</span>
				) : null}
			</label>
			<div className={styles["control"]}>
				{leadingIconName ? (
					<Icon className={styles["leading-icon"]} iconName={leadingIconName} />
				) : null}
				<select
					{...restField}
					aria-describedby={describedById}
					aria-invalid={hasError || undefined}
					aria-required={isRequired || undefined}
					className={getValidClasses(
						styles["select"],
						styles[size],
						hasError && styles["error"],
						leadingIconName && styles["with-leading-icon"],
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
