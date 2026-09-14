import {
	AiCodingTool,
	aiCodingToolToLabel,
} from "~/modules/users/users.js";

const EMPTY_AI_CODING_TOOL = "" as const;

const AI_CODING_TOOL_OPTIONS = Object.values(AiCodingTool).map((value) => {
	return {
		label: aiCodingToolToLabel[value],
		value,
	};
});

export { AI_CODING_TOOL_OPTIONS, EMPTY_AI_CODING_TOOL };
