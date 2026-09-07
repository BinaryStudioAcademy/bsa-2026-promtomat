import React, { useCallback, useId } from "react";
import {
	type Control,
	type FieldPathByValue,
	type FieldValues,
	useController,
} from "react-hook-form";

import { WORKSPACE_STACK_TAG_OPTIONS } from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	isDisabled?: boolean;
	name: FieldPathByValue<T, string[]>;
};

const EMPTY_OPTION_VALUE = "";

const WorkspaceStackTagsSelect = <T extends FieldValues>({
	control,
	isDisabled = false,
	name,
}: Properties<T>): React.JSX.Element => {
	const selectId = useId();

	const {
		field,
		fieldState: { error },
	} = useController({ control, disabled: isDisabled, name });

	const [selectedStackTag] = field.value as string[];

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>): void => {
			const { value } = event.target;

			field.onChange(value === EMPTY_OPTION_VALUE ? [] : [value]);
		},
		[field],
	);

	return (
		<div className={styles["field"]}>
			<label className={styles["label"]} htmlFor={selectId}>
				Stack Tags
			</label>
			<select
				className={styles["select"]}
				disabled={field.disabled}
				id={selectId}
				name={field.name}
				onBlur={field.onBlur}
				onChange={handleChange}
				value={selectedStackTag ?? EMPTY_OPTION_VALUE}
			>
				<option value={EMPTY_OPTION_VALUE}>No tags</option>
				{WORKSPACE_STACK_TAG_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<span className={styles["message"]}>{error?.message}</span>
		</div>
	);
};

export { WorkspaceStackTagsSelect };
