import { useEffect } from "react";
import {
	type FieldPath,
	type FieldValues,
	type PathValue,
	type UseFormSetValue,
} from "react-hook-form";

type Parameters<T extends FieldValues, Name extends FieldPath<T>> = {
	name: Name;
	setValue: UseFormSetValue<T>;
	value: PathValue<T, Name> | undefined;
};

const useSyncedFormValue = <T extends FieldValues, Name extends FieldPath<T>>({
	name,
	setValue,
	value,
}: Parameters<T, Name>): void => {
	useEffect(() => {
		if (value === undefined) {
			return;
		}

		setValue(name, value);
	}, [name, setValue, value]);
};

export { useSyncedFormValue };
