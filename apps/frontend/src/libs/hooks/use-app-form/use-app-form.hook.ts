import { zodResolver } from "@hookform/resolvers/zod";
import {
	type Control,
	type DefaultValues,
	type FieldErrors,
	type FieldValues,
	type FormState,
	type UseFormClearErrors,
	type UseFormHandleSubmit,
	type UseFormProps,
	type UseFormReset,
	type UseFormSetError,
	type UseFormSetValue,
	type ValidationMode,
} from "react-hook-form";
import { useForm } from "react-hook-form";

import { FormValidationMode } from "~/libs/enums/enums.js";
import { type ValidationSchema } from "~/libs/types/types.js";

type Parameters<T extends FieldValues = FieldValues> = {
	defaultValues: DefaultValues<T>;
	isDisabled?: boolean;
	mode?: keyof ValidationMode;
	validationSchema?: ValidationSchema;
};

type ReturnValue<T extends FieldValues = FieldValues> = {
	clearErrors: UseFormClearErrors<T>;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	formState: Pick<FormState<T>, "isDirty" | "isValid">;
	handleSubmit: UseFormHandleSubmit<T>;
	reset: UseFormReset<T>;
	setError: UseFormSetError<T>;
	setValue: UseFormSetValue<T>;
};

const useAppForm = <T extends FieldValues = FieldValues>({
	defaultValues,
	isDisabled = false,
	mode = FormValidationMode.ON_SUBMIT,
	validationSchema,
}: Parameters<T>): ReturnValue<T> => {
	let parameters: UseFormProps<T> = {
		defaultValues,
		disabled: isDisabled,
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
		formState,
		handleSubmit,
		reset,
		setError,
		setValue,
	} = useForm<T>(parameters);

	return {
		clearErrors,
		control,
		errors: formState.errors,
		formState,
		handleSubmit,
		reset,
		setError,
		setValue,
	};
};

export { useAppForm };
