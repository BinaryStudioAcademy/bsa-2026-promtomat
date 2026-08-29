import { AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const DEBUG_ENVIRONMENTS: ReadonlySet<ValueOf<typeof AppEnvironment>> = new Set(
	[AppEnvironment.DEVELOPMENT, AppEnvironment.LOCAL],
);

const checkIsDebugEnvironment = (
	environment: ValueOf<typeof AppEnvironment>,
): boolean => DEBUG_ENVIRONMENTS.has(environment);

export { checkIsDebugEnvironment };
