import { useEffect, useMemo, useState } from "react";

import { getTechStackTagSuggestions } from "~/libs/helpers/helpers.js";

import { FIRST_ELEMENT_INDEX } from "../../../workspace-create-form/libs/constants/constants.js";
import { INDEX_STEP, NO_ACTIVE_SUGGESTION } from "../constants/constants.js";

type UseSuggestionsProperties = {
	inputValue: string;
	isOpen: boolean;
	selectedTags: string[];
};

const useSuggestions = ({
	inputValue,
	isOpen,
	selectedTags,
}: UseSuggestionsProperties) => {
	const [activeIndex, setActiveIndex] = useState(NO_ACTIVE_SUGGESTION);

	const suggestions = useMemo(() => {
		if (!isOpen) {
			return [];
		}

		return getTechStackTagSuggestions(inputValue).filter(
			(tag) => !selectedTags.includes(tag),
		);
	}, [inputValue, isOpen, selectedTags]);

	useEffect(() => {
		if (suggestions.length > NO_ACTIVE_SUGGESTION) {
			setActiveIndex(FIRST_ELEMENT_INDEX);
		} else {
			setActiveIndex(NO_ACTIVE_SUGGESTION);
		}
	}, [suggestions]);

	const resetActiveIndex = () => {
		setActiveIndex(NO_ACTIVE_SUGGESTION);
	};

	const setActiveIndexDirectly = (index: number) => {
		setActiveIndex(index);
	};

	const selectNext = () => {
		setActiveIndex((previous) => {
			if (suggestions.length === NO_ACTIVE_SUGGESTION) {
				return NO_ACTIVE_SUGGESTION;
			}

			const nextIndex = previous + INDEX_STEP;
			return nextIndex < suggestions.length ? nextIndex : FIRST_ELEMENT_INDEX;
		});
	};

	const selectPrevious = () => {
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

	const getActiveSuggestion = () => {
		if (activeIndex === NO_ACTIVE_SUGGESTION) {
			return suggestions[FIRST_ELEMENT_INDEX];
		}

		return suggestions[activeIndex] ?? suggestions[FIRST_ELEMENT_INDEX];
	};

	return {
		activeIndex,
		getActiveSuggestion,
		hasSuggestions: suggestions.length > NO_ACTIVE_SUGGESTION,
		resetActiveIndex,
		selectNext,
		selectPrevious,
		setActiveIndexDirectly,
		suggestions,
	};
};

export { useSuggestions };
