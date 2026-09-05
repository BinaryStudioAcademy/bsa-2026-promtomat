import { z } from "zod";

const stackTagsField = z.array(z.string());

export { stackTagsField };
