import { type StopReason } from "@aws-sdk/client-bedrock-runtime";

import { TRUNCATED_STOP_REASONS } from "../constants/constants.js";

const checkIsTextTruncated = (stopReason: StopReason | undefined): boolean => {
	if (stopReason === undefined) {
		return false;
	}

	return TRUNCATED_STOP_REASONS.includes(stopReason);
};

export { checkIsTextTruncated };
