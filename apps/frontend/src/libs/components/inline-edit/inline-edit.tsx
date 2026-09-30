import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import {
	ControlSize,
	InlineEditVariant,
	KeyboardKey,
} from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { Input } from "../input/input.js";
import inputStyles from "../input/styles.module.css";
import { Textarea } from "../textarea/textarea.js";
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
	variant?: ValueOf<typeof InlineEditVariant>;
};

const ZERO_VALUE = 0;

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
	variant = InlineEditVariant.INPUT,
}: Properties<T>): React.JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);
	const containerReference = useRef<HTMLDivElement>(null);
	const previewButtonReference = useRef<HTMLButtonElement>(null);
	const originalValueReference = useRef<unknown>(null);

	const editClassName = getValidClasses(className, styles["base-text"]);

	const { field } = useController({
		control,
		disabled: isDisabled,
		name,
	});

	useEffect(() => {
		if (!isEditing || !containerReference.current) {
			return;
		}

		const inputElement =
			containerReference.current.querySelector<HTMLElement>("input, textarea");

		inputElement?.focus();
	}, [isEditing]);

	const handleCancelEditing = useCallback((): void => {
		field.onChange(originalValueReference.current);
		setIsEditing(false);
		setTimeout(() => previewButtonReference.current?.focus(), ZERO_VALUE);
	}, [field]);

	const handleSaveEditing = useCallback((): void => {
		setIsEditing(false);
		if (field.value !== originalValueReference.current) {
			onSave?.();
		}
		setTimeout(() => previewButtonReference.current?.focus(), ZERO_VALUE);
	}, [field, onSave]);

	const handleStartEditing = useCallback(
		(
			event:
				| React.FocusEvent<HTMLButtonElement>
				| React.MouseEvent<HTMLButtonElement>,
		): void => {
			event.preventDefault();
			event.stopPropagation();
			if (isDisabled) {
				return;
			}
			originalValueReference.current = field.value;
			setIsEditing(true);
		},
		[isDisabled, field.value],
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>) => {
			event.stopPropagation();
			if (event.key === KeyboardKey.ENTER) {
				event.preventDefault();
				handleSaveEditing();
			} else if (event.key === KeyboardKey.ESCAPE) {
				event.preventDefault();
				handleCancelEditing();
			}
		},
		[handleSaveEditing, handleCancelEditing],
	);

	const handleBlur = useCallback(
		(event: React.FocusEvent<HTMLDivElement | HTMLTextAreaElement>) => {
			if (!event.currentTarget.contains(event.relatedTarget)) {
				handleSaveEditing();
			}
		},
		[handleSaveEditing],
	);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement | HTMLTextAreaElement>) => {
			event.preventDefault();
			event.stopPropagation();
		},
		[],
	);

	if (isEditing) {
		return (
			<div className={styles["wrap"]} ref={containerReference}>
				{variant === InlineEditVariant.INPUT ? (
					<Input
						className={editClassName}
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
					/>
				) : (
					<Textarea
						className={editClassName}
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
						rows={1}
						size={size}
					/>
				)}
			</div>
		);
	}

	return (
		<div className={getValidClasses(inputStyles["field"], styles["wrap"])}>
			<label
				className={getValidClasses(
					inputStyles["label"],
					isLabelHidden && "visually-hidden",
				)}
			>
				{label}
			</label>
			<div className={inputStyles["control"]}>
				<button
					className={getValidClasses(
						styles["base-text"],
						styles["preview"],
						className,
					)}
					onClick={handleStartEditing}
					ref={previewButtonReference}
					type="button"
				>
					{field.value || placeholder}
				</button>
			</div>
		</div>
	);
};

export { InlineEdit };
