import { type ValueOf } from "~/libs/types/types.js";

import { type ToolOutcome } from "../enums/enums.js";

type ToolCallLog = {
	error?: unknown;
	outcome: ValueOf<typeof ToolOutcome>;
	startedAt: number;
	toolName: string;
};

export { type ToolCallLog };
