import { z } from "zod";

import { DEFAULT_TIME_ZONE } from "../constants/constants.js";

const promptStreakQuery = z.object({
	timeZone: z.string().default(DEFAULT_TIME_ZONE),
});

export { promptStreakQuery };
