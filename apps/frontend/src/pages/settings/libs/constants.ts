import { type ValueOf } from "~/libs/types/types.js";
import { AiCodingTool } from "~/modules/users/users.js";

const EMPTY_AI_CODING_TOOL = "" as const;
const FIRST_INDEX = 0;

const AI_CODING_TOOL_LABELS: Record<ValueOf<typeof AiCodingTool>, string> = {
	[AiCodingTool.CHATGPT]: "ChatGPT",
	[AiCodingTool.CLAUDE_CODE]: "Claude Code",
	[AiCodingTool.CURSOR]: "Cursor",
	[AiCodingTool.GEMINI]: "Gemini",
	[AiCodingTool.GITHUB_COPILOT]: "GitHub Copilot",
	[AiCodingTool.JETBRAINS_AI]: "JetBrains AI",
	[AiCodingTool.WINDSURF]: "Windsurf",
};

const AI_CODING_TOOL_OPTIONS = Object.values(AiCodingTool).map((value) => {
	return {
		label: AI_CODING_TOOL_LABELS[value],
		value,
	};
});

export { AI_CODING_TOOL_OPTIONS, EMPTY_AI_CODING_TOOL, FIRST_INDEX };
