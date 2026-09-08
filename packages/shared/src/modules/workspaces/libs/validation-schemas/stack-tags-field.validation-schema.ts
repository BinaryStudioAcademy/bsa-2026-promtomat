import { z } from "zod";

const stackTagsField = z.array(z.string()).optional().default([]);

export { stackTagsField };
