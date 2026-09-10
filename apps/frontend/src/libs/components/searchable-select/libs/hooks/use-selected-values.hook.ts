import { useCallback } from "react";

import {
	EMPTY_SELECTION_LENGTH,
	NO_ACTIVE_SUGGESTION,
} from "../constants/constants.js";
import {
	type UseSelectedValuesParameters,
	type UseSelectedValuesResult,
} from "../types/types.js";

const useSelectedValues = ({
	onChange,
	selectedValues,
}: UseSelectedValuesParameters): UseSelectedValuesResult => {
	const addValue = useCallback(
		(value: string): void => {
			onChange([...selectedValues, value]);
		},
		[onChange, selectedValues],
	);

	const removeValue = useCallback(
		(value: string): void => {
			onChange(
				selectedValues.filter((selectedValue) => selectedValue !== value),
			);
		},
		[onChange, selectedValues],
	);

	const removeLastValue = useCallback((): void => {
		if (selectedValues.length === EMPTY_SELECTION_LENGTH) {
			return;
		}

		const lastValue = selectedValues.at(NO_ACTIVE_SUGGESTION);

		if (lastValue) {
			removeValue(lastValue);
		}
	}, [removeValue, selectedValues]);

	return {
		addValue,
		removeLastValue,
		removeValue,
	};
};

export { useSelectedValues };
