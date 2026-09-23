import { z } from "zod";

const promptStreakQuery = z.object({
	timeZone: z.string().nonempty().default("UTC"),
});

export { promptStreakQuery };
