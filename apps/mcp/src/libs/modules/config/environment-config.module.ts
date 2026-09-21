import { type Config, type EnvironmentSchema } from "./libs/types/types.js";
import { environmentValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

const ISSUE_SEPARATOR = "; ";

class EnvironmentConfig implements Config {
	public ENV: EnvironmentSchema;

	public constructor(environment: Record<string, string | undefined>) {
		const result = environmentValidationSchema.safeParse(environment);

		if (!result.success) {
			throw new Error(
				result.error.issues.map((issue) => issue.message).join(ISSUE_SEPARATOR),
			);
		}

		this.ENV = result.data;
	}
}

export { EnvironmentConfig };
