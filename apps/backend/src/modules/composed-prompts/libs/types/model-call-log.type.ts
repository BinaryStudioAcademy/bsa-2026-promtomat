import { type ValueOf } from "~/libs/types/types.js";

import { type ModelCallOutcome } from "../enums/enums.js";

type ModelCallLog = {
	durationMs: number;
	outcome: ValueOf<typeof ModelCallOutcome>;
	sourceCount: number;
	workspaceId: number;
};

export { type ModelCallLog };
