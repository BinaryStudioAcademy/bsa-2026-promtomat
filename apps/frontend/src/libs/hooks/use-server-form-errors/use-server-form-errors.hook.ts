import { useEffect, useMemo } from "react";
import {
	type FieldPath,
	type FieldValues,
	type UseFormClearErrors,
	type UseFormSetError,
} from "react-hook-form";

import { isValidationError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";

type Parameters<T extends FieldValues> = {
	clearErrors: UseFormClearErrors<T>;
	error: unknown;
	fields: FieldPath<T>[];
	setError: UseFormSetError<T>;
};

type ServerFormErrorsResult = {
	hasFieldErrors: boolean;
};

const useServerFormErrors = <T extends FieldValues>({
	clearErrors,
	error,
	fields,
	setError,
}: Parameters<T>): ServerFormErrorsResult => {
	const details = useMemo(
		() => (isValidationError(error) ? error.details : []),
		[error],
	);

	useEffect(() => {
		clearErrors(fields);

		for (const detail of details) {
			setError(detail.path.join(".") as FieldPath<T>, {
				message: detail.message,
			});
		}
	}, [clearErrors, details, fields, setError]);

	const [firstDetail] = details;

	return { hasFieldErrors: firstDetail !== undefined };
};

export { useServerFormErrors };
