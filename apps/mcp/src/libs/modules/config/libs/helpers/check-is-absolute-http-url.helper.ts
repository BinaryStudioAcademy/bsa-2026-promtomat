import { HTTP_PROTOCOL_PATTERN } from "../constants/constants.js";

const checkIsAbsoluteHttpUrl = (value: string): boolean => {
	try {
		return HTTP_PROTOCOL_PATTERN.test(new URL(value).protocol);
	} catch {
		return false;
	}
};

export { checkIsAbsoluteHttpUrl };
