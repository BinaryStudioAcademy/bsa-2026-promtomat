import React, { useId } from "react";
import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

type Properties<T extends FieldValues> = {
	autocomplite?: string;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	label: string;
	name: FieldPath<T>;
	placeholder?: string;
	type?: "email" | "password" | "text";
};

const Input = <T extends FieldValues>({
	autocomplite,
	control,
	errors,
	label,
	name,
	placeholder = "",
	type = "text",
}: Properties<T>): React.JSX.Element => {
	const { field } = useController({ control, name });
	const errorId = useId();

	const error = errors[name]?.message;
	const hasError = Boolean(error);

	return (
		<label>
			<span>{label}</span>
			<input
				{...field}
				aria-describedby={hasError ? errorId : undefined}
				aria-invalid={hasError || undefined}
				autoComplete={autocomplite}
				placeholder={placeholder}
				type={type}
			/>
			<span id={errorId} role="alert">
				{hasError ? (error as string) : ""}
			</span>
		</label>
	);
};

export { Input };
