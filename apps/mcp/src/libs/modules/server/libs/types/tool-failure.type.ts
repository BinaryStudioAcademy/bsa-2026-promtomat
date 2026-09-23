import { type ValueOf } from "~/libs/types/types.js";

import { type ToolOutcome } from "../enums/enums.js";

type ToolFailure = {
	outcome: Exclude<ValueOf<typeof ToolOutcome>, typeof ToolOutcome.OK>;
	text: string;
};

export { type ToolFailure };
