import { type ValueOf } from "~/libs/types/types.js";

import { type FallbackReason } from "../enums/enums.js";

type FallbackMapping = {
	isConfigurationFault: boolean;
	reason: ValueOf<typeof FallbackReason>;
};

export { type FallbackMapping };
