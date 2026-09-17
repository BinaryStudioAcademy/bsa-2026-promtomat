import { ErrorCode } from "~/libs/enums/enums.js";

const EMAIL_ERROR_CODES: ReadonlySet<string> = new Set([
	ErrorCode.CONTRIBUTOR_ALREADY_EXISTS,
	ErrorCode.USER_NOT_FOUND,
	ErrorCode.WORKSPACE_OWNER_CANNOT_BE_ADDED_AS_CONTRIBUTOR,
]);

export { EMAIL_ERROR_CODES };
