import React from "react";
import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	errors: FieldErrors<T>;
	label: string;
	maxLength?: number;
	name: FieldPath<T>;
	placeholder?: string;
	type?: "email" | "text";
};

const Input = <T extends FieldValues>({
	control,
	errors,
	label,
	maxLength,
	name,
	placeholder = "",
	type = "text",
}: Properties<T>): React.JSX.Element => {
	const { field } = useController({ control, name });

	const error = errors[name]?.message;
	const hasError = Boolean(error);

	return (
		<label>
			<span>{label}</span>
			<input
				{...field}
				maxLength={maxLength}
				placeholder={placeholder}
				type={type}
			/>
			{hasError && <span>{error as string}</span>}
		</label>
	);
};

export { Input };
