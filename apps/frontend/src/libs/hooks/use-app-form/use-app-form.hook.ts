import { zodResolver } from "@hookform/resolvers/zod";
import {
	type Control,
	type DefaultValues,
	type FieldErrors,
	type FieldValues,
	type UseFormClearErrors,
	type UseFormHandleSubmit,
	type UseFormProps,
	type UseFormSetError,
	type ValidationMode,
} from "react-hook-form";
import { useForm } from "react-hook-form";

import { type ValidationSchema } from "~/libs/types/types.js";

type Parameters<T extends FieldValues = FieldValues> = {
	defaultValues: DefaultValues<T>;
	mode?: keyof ValidationMode;
	validationSchema?: ValidationSchema;
};

type ReturnValue<T extends FieldValues = FieldValues> = {
	clearErrors: UseFormClearErrors<T>;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	handleSubmit: UseFormHandleSubmit<T>;
	setError: UseFormSetError<T>;
};

const useAppForm = <T extends FieldValues = FieldValues>({
	defaultValues,
	mode = "onSubmit",
	validationSchema,
}: Parameters<T>): ReturnValue<T> => {
	let parameters: UseFormProps<T> = {
		defaultValues,
		mode,
	};

	if (validationSchema) {
		parameters = {
			...parameters,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ValidationSchema is intentionally untyped generic shared type
			resolver: zodResolver(validationSchema as any),
		};
	}

	const {
		clearErrors,
		control,
		formState: { errors },
		handleSubmit,
		setError,
	} = useForm<T>(parameters);

	return {
		clearErrors,
		control,
		errors,
		handleSubmit,
		setError,
	};
};

export { useAppForm };
