import { type z } from "zod";

import { type analyticsQueryValidationSchema } from "../validation-schemas/validation-schemas.js";

type AnalyticsQueryDto = z.infer<typeof analyticsQueryValidationSchema>;

export { type AnalyticsQueryDto };
