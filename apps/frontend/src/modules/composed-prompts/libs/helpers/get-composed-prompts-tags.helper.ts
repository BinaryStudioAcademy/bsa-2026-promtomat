import { ComposedPromptsApiTag } from "../enums/enums.js";

const LIST_TAG_ID = "LIST";

type ResultItems = {
	items: { id: number }[];
};

type Tag = {
	id: number | string;
	type: typeof ComposedPromptsApiTag.COMPOSED_PROMPT;
};

const getComposedPromptsTags = (result: ResultItems | undefined): Tag[] => {
	const listTag: Tag = {
		id: LIST_TAG_ID,
		type: ComposedPromptsApiTag.COMPOSED_PROMPT,
	};

	if (!result) {
		return [listTag];
	}

	return [
		...result.items.map((item): Tag => ({
			id: item.id,
			type: ComposedPromptsApiTag.COMPOSED_PROMPT,
		})),
		listTag,
	];
};

export { getComposedPromptsTags };
