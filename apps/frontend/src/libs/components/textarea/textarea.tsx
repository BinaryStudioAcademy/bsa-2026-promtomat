import React, { useCallback, useEffect, useRef } from "react";
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
		disabled?: boolean;
		label: string;
		name: FieldPath<T>;
		rows?: number;
		size?: ValueOf<typeof ControlSize>;
	};

const Textarea = <T extends FieldValues>({
	control,
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

	const textareaReferance = useRef<HTMLTextAreaElement | null>(null);
	const hasError = Boolean(error);

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
		<label className={styles["field"]}>
			<span className={styles["label"]}>{label}</span>
			<textarea
				{...rest}
				{...field}
				className={getValidClasses(
					styles["textarea"],
					styles[size],
					hasError && styles["error"],
					styles["autoResize"],
				)}
				onChange={handleChange}
				ref={handleReference}
			/>
			{error ? (
				<span className={styles["message"]}>{error.message}</span>
			) : null}
		</label>
	);
};

export { Textarea };
