import { type ValueOf } from "~/libs/types/types.js";

import { AiCodingTool } from "../enums/enums.js";

const aiCodingToolToLabel = {
	[AiCodingTool.CHATGPT]: "ChatGPT",
	[AiCodingTool.CLAUDE_CODE]: "Claude Code",
	[AiCodingTool.CURSOR]: "Cursor",
	[AiCodingTool.GEMINI]: "Gemini",
	[AiCodingTool.GITHUB_COPILOT]: "GitHub Copilot",
	[AiCodingTool.JETBRAINS_AI]: "JetBrains AI",
	[AiCodingTool.WINDSURF]: "Windsurf",
} satisfies Record<ValueOf<typeof AiCodingTool>, string>;

export { aiCodingToolToLabel };
