import { ComposedPromptsApiTag } from "../enums/enums.js";
import { type ComposedPromptGetAllResponseDto } from "../types/types.js";

const LIST_TAG_ID = "LIST";

type Tag = {
	id: number | string;
	type: typeof ComposedPromptsApiTag.COMPOSED_PROMPT;
};

const getComposedPromptsTags = (
	result: ComposedPromptGetAllResponseDto | undefined,
): Tag[] => {
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
