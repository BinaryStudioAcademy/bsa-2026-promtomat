import React, { useCallback, useEffect, useId, useRef } from "react";
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

type Properties<T extends FieldValues> =
	React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
		control: Control<T, null>;
		descriptionId?: string;
		disabled?: boolean;
		label: string;
		name: FieldPath<T>;
		rows?: number;
		size?: ValueOf<typeof ControlSize>;
	};

const Textarea = <T extends FieldValues>({
	control,
	descriptionId,
	disabled = false,
	label,
	name,
	size = ControlSize.MD,
	...rest
}: Properties<T>): React.JSX.Element => {
	const {
		field,
		fieldState: { error },
	} = useController({
		control,
		disabled,
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
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${String(textarea.scrollHeight)}px`;
		}
	}, []);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>) => {
			field.onChange(event);
			adjustHeight();
		},
		[field, adjustHeight],
	);

	const handleReference = useCallback(
		(element: HTMLTextAreaElement | null) => {
			field.ref(element);
			textareaReferance.current = element;
		},
		[field],
	);

	useEffect(() => {
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
						styles["autoResize"],
					)}
					id={textareaId}
					onChange={handleChange}
					ref={handleReference}
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
