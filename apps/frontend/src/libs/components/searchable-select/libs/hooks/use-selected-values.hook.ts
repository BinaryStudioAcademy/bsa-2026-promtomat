import { useCallback } from "react";

import {
	EMPTY_SELECTION_LENGTH,
	NO_ACTIVE_SUGGESTION,
} from "../constants/constants.js";
import { type UseSelectedValuesParameters } from "../types/types.js";

const useSelectedValues = ({
	onChange,
	selectedValues,
}: UseSelectedValuesParameters) => {
	const addValue = useCallback(
		(value: string) => {
			onChange([...selectedValues, value]);
		},
		[onChange, selectedValues],
	);

	const removeValue = useCallback(
		(value: string) => {
			onChange(
				selectedValues.filter((selectedValue) => selectedValue !== value),
			);
		},
		[onChange, selectedValues],
	);

	const removeLastValue = useCallback(() => {
		if (selectedValues.length === EMPTY_SELECTION_LENGTH) {
			return;
		}

		const lastValue = selectedValues.at(NO_ACTIVE_SUGGESTION);

		if (lastValue) {
			removeValue(lastValue);
		}
	}, [removeValue, selectedValues]);

	const isValueSelected = useCallback(
		(value: string) => selectedValues.includes(value),
		[selectedValues],
	);

	return {
		addValue,
		isValueSelected,
		removeLastValue,
		removeValue,
	};
};

export { useSelectedValues };
