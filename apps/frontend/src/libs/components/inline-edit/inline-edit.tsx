import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { ControlSize, TabIndex } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { Input } from "../input/input.js";
import inputStyles from "../input/styles.module.css";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	className?: string | undefined;
	control: Control<T, null>;
	descriptionId?: string;
	isDisabled?: boolean;
	isLabelHidden?: boolean;
	label: string;
	name: FieldPath<T>;
	onSave?: () => void;
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
};

const InlineEdit = <T extends FieldValues>({
	className = "",
	control,
	descriptionId,
	isDisabled = false,
	isLabelHidden = false,
	label,
	name,
	onSave,
	placeholder = "",
	size = ControlSize.MD,
	...rest
}: Properties<T>): React.JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);
	const wrapperReference = useRef<HTMLDivElement>(null);
	const originalValueReference = useRef<unknown>(null);

	const { field } = useController({
		control,
		disabled: isDisabled,
		name,
	});

	useEffect(() => {
		if (!isEditing || !wrapperReference.current) {
			return;
		}

		const inputElement = wrapperReference.current.querySelector("input");
		inputElement?.focus();
	}, [isEditing]);

	const handleCancelEditing = useCallback((): void => {
		field.onChange(originalValueReference.current);
		setIsEditing(false);
	}, [field]);

	const handleSaveEditing = useCallback((): void => {
		setIsEditing(false);
		if (field.value !== originalValueReference.current) {
			onSave?.();
		}
	}, [field, onSave]);

	const handleStartEditing = useCallback((): void => {
		if (isDisabled) {
			return;
		}
		originalValueReference.current = field.value;
		setIsEditing(true);
	}, [isDisabled, field.value]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			event.stopPropagation();
			if (event.key === "Enter") {
				handleSaveEditing();
			} else if (event.key === "Escape") {
				handleCancelEditing();
			}
		},
		[handleSaveEditing, handleCancelEditing],
	);

	const handleBlur = useCallback(
		(event: React.FocusEvent<HTMLDivElement>) => {
			if (!event.currentTarget.contains(event.relatedTarget)) {
				handleCancelEditing();
			}
		},
		[handleCancelEditing],
	);

	const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
	}, []);

	if (isEditing) {
		return (
			<div ref={wrapperReference}>
				<Input
					className={className}
					control={control}
					descriptionId={descriptionId}
					isDisabled={isDisabled}
					isLabelHidden={isLabelHidden}
					label={label}
					name={name}
					onBlur={handleBlur}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					size={size}
					{...rest}
				/>
			</div>
		);
	}

	return (
		<div className={inputStyles["field"]}>
			<label
				className={getValidClasses(
					inputStyles["label"],
					isLabelHidden && "visually-hidden",
				)}
			>
				{label}
			</label>
			<div className={inputStyles["control"]}>
				<span
					className={getValidClasses(
						styles["preview"],
						inputStyles[size],
						className,
					)}
					onClick={handleStartEditing}
					onFocus={handleStartEditing}
					onKeyDown={handleStartEditing}
					role="button"
					tabIndex={isDisabled ? TabIndex.HIDDEN : TabIndex.FOCUSABLE}
				>
					{field.value || placeholder}
				</span>
			</div>
		</div>
	);
};

export { InlineEdit };
