import { useCallback } from "react";

import {
	EMPTY_SELECTION_LENGTH,
	NO_ACTIVE_SUGGESTION,
} from "../constants/constants.js";

type UseTagsProperties = {
	onChange: (tags: string[]) => void;
	selectedTags: string[];
};

const useTags = ({ onChange, selectedTags }: UseTagsProperties) => {
	const addTag = useCallback(
		(tag: string) => {
			onChange([...selectedTags, tag]);
		},
		[onChange, selectedTags],
	);

	const removeTag = useCallback(
		(tag: string) => {
			onChange(selectedTags.filter((selectedTag) => selectedTag !== tag));
		},
		[onChange, selectedTags],
	);

	const removeLastTag = useCallback(() => {
		if (selectedTags.length === EMPTY_SELECTION_LENGTH) {
			return;
		}

		const lastTag = selectedTags.at(NO_ACTIVE_SUGGESTION);

		if (lastTag) {
			removeTag(lastTag);
		}
	}, [removeTag, selectedTags]);

	const isTagSelected = useCallback(
		(tag: string) => selectedTags.includes(tag),
		[selectedTags],
	);

	return {
		addTag,
		isTagSelected,
		removeLastTag,
		removeTag,
	};
};

export { useTags };
