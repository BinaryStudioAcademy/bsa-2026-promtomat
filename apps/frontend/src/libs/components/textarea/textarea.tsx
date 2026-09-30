import React, { useCallback, useId, useLayoutEffect, useRef } from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { MAX_HEIGHT } from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> =
	React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
		className?: string | undefined;
		control: Control<T, null>;
		descriptionId?: string | undefined;
		isDisabled?: boolean;
		isLabelHidden?: boolean;
		isMessageHidden?: boolean;
		label: string;
		maxHeight?: null | number;
		name: FieldPath<T>;
		onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
		onClick?: React.MouseEventHandler<HTMLTextAreaElement>;
		onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
		rows?: number;
		size?: ValueOf<typeof ControlSize>;
	};

const Textarea = <T extends FieldValues>({
	className,
	control,
	descriptionId,
	isDisabled = false,
	isLabelHidden = false,
	isMessageHidden = false,
	label,
	maxHeight = MAX_HEIGHT,
	name,
	onBlur,
	onClick,
	onKeyDown,
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

		const computedStyle = getComputedStyle(textarea);
		const borderTop =
			Number(computedStyle.borderTopWidth.replace("px", "")) || ZERO_VALUE;
		const borderBottom =
			Number(computedStyle.borderBottomWidth.replace("px", "")) || ZERO_VALUE;

		const totalRequiredHeight =
			textarea.scrollHeight + borderTop + borderBottom;

		if (maxHeight === null) {
			textarea.style.height = `${String(totalRequiredHeight)}px`;
			textarea.style.overflowY = "hidden";
			return;
		}

		const height = Math.min(totalRequiredHeight, maxHeight);

		textarea.style.height = `${String(height)}px`;
		textarea.style.overflowY =
			totalRequiredHeight > maxHeight ? "auto" : "hidden";
	}, [maxHeight]);

	const handleReference = useCallback(
		(element: HTMLTextAreaElement | null) => {
			field.ref(element);
			textareaReferance.current = element;
		},
		[field],
	);

	const handleBlur = useCallback(
		(event: React.FocusEvent<HTMLTextAreaElement>): void => {
			field.onBlur();
			onBlur?.(event);
		},
		[field, onBlur],
	);

	useLayoutEffect(() => {
		adjustHeight();
	}, [field.value, adjustHeight]);

	return (
		<div className={styles["field"]}>
			<label
				className={getValidClasses(
					styles["label"],
					isLabelHidden && "visually-hidden",
				)}
				htmlFor={textareaId}
			>
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
						className,
					)}
					id={textareaId}
					onBlur={handleBlur}
					onChange={field.onChange}
					onClick={onClick}
					onKeyDown={onKeyDown}
					ref={handleReference}
					rows={rows}
				/>
			</div>
			{!descriptionId && (!isMessageHidden || errorMessage !== undefined) && (
				<span className={styles["message"]} id={errorMessageId}>
					{errorMessage}
				</span>
			)}
		</div>
	);
};

export { Textarea };
