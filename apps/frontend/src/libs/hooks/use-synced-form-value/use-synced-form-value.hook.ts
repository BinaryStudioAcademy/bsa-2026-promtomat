import { useEffect } from "react";
import {
	type FieldPath,
	type FieldValues,
	type PathValue,
	type UseFormSetValue,
} from "react-hook-form";

type Parameters<T extends FieldValues> = {
	name: FieldPath<T>;
	setValue: UseFormSetValue<T>;
	value: PathValue<T, FieldPath<T>> | undefined;
};

const useSyncedFormValue = <T extends FieldValues>({
	name,
	setValue,
	value,
}: Parameters<T>): void => {
	useEffect(() => {
		if (value === undefined) {
			return;
		}

		setValue(name, value);
	}, [name, setValue, value]);
};

export { useSyncedFormValue };
