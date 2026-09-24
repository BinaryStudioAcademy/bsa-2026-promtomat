import { z } from "zod";

const errorResponseValidationSchema = z.object({
	code: z.string(),
	message: z.string(),
});

export { errorResponseValidationSchema };
