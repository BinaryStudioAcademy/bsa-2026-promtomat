import React, { useCallback, useId, useLayoutEffect, useRef } from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { MAX_HEIGHT } from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> =
	React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
		control: Control<T, null>;
		descriptionId?: string;
		isDisabled?: boolean;
		label: string;
		maxHeight?: number;
		name: FieldPath<T>;
		rows?: number;
		size?: ValueOf<typeof ControlSize>;
	};

const Textarea = <T extends FieldValues>({
	control,
	descriptionId,
	isDisabled = false,
	label,
	maxHeight = MAX_HEIGHT,
	name,
	rows,
	size = ControlSize.MD,
	...rest
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
	const textareaId = useId();

	const textareaReferance = useRef<HTMLTextAreaElement | null>(null);
	const hasError = Boolean(error);
	const errorMessage = error?.message;
	const describedById =
		descriptionId ?? (errorMessage === undefined ? undefined : errorMessageId);

	const adjustHeight = useCallback(() => {
		const textarea = textareaReferance.current;

		if (!textarea) {
			return;
		}

		textarea.style.height = "auto";
		const height = Math.min(textarea.scrollHeight, maxHeight);

		textarea.style.height = `${String(height)}px`;
		textarea.style.overflowY =
			textarea.scrollHeight > maxHeight ? "auto" : "hidden";
	}, [maxHeight]);

	const handleReference = useCallback(
		(element: HTMLTextAreaElement | null) => {
			field.ref(element);
			textareaReferance.current = element;
		},
		[field],
	);

	useLayoutEffect(() => {
		adjustHeight();
	}, [field.value, adjustHeight]);

	return (
		<div className={styles["field"]}>
			<label className={styles["label"]} htmlFor={textareaId}>
				{label}
			</label>
			<div className={styles["control"]}>
				<textarea
					{...rest}
					{...field}
					aria-describedby={describedById}
					aria-invalid={hasError || undefined}
					className={getValidClasses(
						styles["textarea"],
						styles[size],
						hasError && styles["error"],
					)}
					id={textareaId}
					onChange={field.onChange}
					ref={handleReference}
					rows={rows}
				/>
			</div>
			{!descriptionId && (
				<span className={styles["message"]} id={errorMessageId}>
					{errorMessage}
				</span>
			)}
		</div>
	);
};

export { Textarea };
