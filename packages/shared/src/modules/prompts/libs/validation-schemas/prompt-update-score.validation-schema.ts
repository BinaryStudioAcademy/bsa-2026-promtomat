import { z } from "zod";

import { promptCreate } from "./create-prompt.validation-schema.js";

const promptUpdateScore = z.object({
	efficiencyScore: promptCreate.shape.efficiencyScore.nullable(),
});

export { promptUpdateScore };
