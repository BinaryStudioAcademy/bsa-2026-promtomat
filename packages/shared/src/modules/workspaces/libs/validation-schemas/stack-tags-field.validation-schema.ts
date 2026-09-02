import { z } from "zod";

import { TechStackTagSchema } from "../modules/tech-stack-tags/tech-stack-tags.js";

const stackTagsField = z.array(TechStackTagSchema).optional().default([]);

export { stackTagsField };
