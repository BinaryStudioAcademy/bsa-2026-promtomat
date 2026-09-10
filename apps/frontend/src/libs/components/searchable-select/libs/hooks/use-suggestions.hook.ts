import { useEffect, useMemo, useState } from "react";

import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";

import {
	EMPTY_SELECTION_LENGTH,
	INDEX_STEP,
	NO_ACTIVE_SUGGESTION,
} from "../constants/constants.js";
import { getValuesSuggestions } from "../helpers/helpers.js";
import {
	type UseSuggestionsProperties,
	type UseSuggestionsResult,
} from "../types/types.js";

const useSuggestions = ({
	inputValue,
	isOpen,
	selectedValues,
	valuesDictionary,
}: UseSuggestionsProperties): UseSuggestionsResult => {
	const [activeIndex, setActiveIndex] = useState(NO_ACTIVE_SUGGESTION);

	const suggestions = useMemo(() => {
		if (!isOpen) {
			return [];
		}

		return getValuesSuggestions(inputValue, valuesDictionary).filter(
			(tag) => !selectedValues.includes(tag),
		);
	}, [inputValue, isOpen, valuesDictionary, selectedValues]);

	useEffect(() => {
		setActiveIndex(
			suggestions.length > EMPTY_SELECTION_LENGTH
				? FIRST_ELEMENT_INDEX
				: NO_ACTIVE_SUGGESTION,
		);
	}, [suggestions]);

	const resetActiveIndex = (): void => {
		setActiveIndex(NO_ACTIVE_SUGGESTION);
	};

	const setActiveIndexDirectly = (index: number): void => {
		setActiveIndex(index);
	};

	const selectNext = (): void => {
		setActiveIndex((previous) => {
			if (suggestions.length === NO_ACTIVE_SUGGESTION) {
				return NO_ACTIVE_SUGGESTION;
			}

			const nextIndex = previous + INDEX_STEP;
			return nextIndex < suggestions.length ? nextIndex : FIRST_ELEMENT_INDEX;
		});
	};

	const selectPrevious = (): void => {
		setActiveIndex((previous) => {
			if (suggestions.length === NO_ACTIVE_SUGGESTION) {
				return NO_ACTIVE_SUGGESTION;
			}

			const previousIndex = previous - INDEX_STEP;
			return previousIndex >= FIRST_ELEMENT_INDEX
				? previousIndex
				: suggestions.length - INDEX_STEP;
		});
	};

	const getActiveSuggestion = (): string | undefined => {
		if (activeIndex === NO_ACTIVE_SUGGESTION) {
			return suggestions[FIRST_ELEMENT_INDEX];
		}

		return suggestions[activeIndex] ?? suggestions[FIRST_ELEMENT_INDEX];
	};

	return {
		activeIndex,
		getActiveSuggestion,
		hasSuggestions: suggestions.length > EMPTY_SELECTION_LENGTH,
		resetActiveIndex,
		selectNext,
		selectPrevious,
		setActiveIndexDirectly,
		suggestions,
	};
};

export { useSuggestions };
