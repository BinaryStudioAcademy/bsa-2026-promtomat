import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import {
	ContributorsErrorCode,
	ContributorsErrorMessage,
} from "../../../modules/workspaces/workspaces.js";
import { ErrorCode } from "../../enums/error-code.enum.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class ContributorError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			code,
			message,
			status,
		});
	}

	public static alreadyExists(): ContributorError {
		return new ContributorError({
			code: ContributorsErrorCode.CONTRIBUTOR_ALREADY_EXISTS,
			message: ContributorsErrorMessage.CONTRIBUTOR_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static notFound(): ContributorError {
		return new ContributorError({
			code: ContributorsErrorCode.CONTRIBUTOR_NOT_FOUND,
			message: ContributorsErrorMessage.CONTRIBUTOR_NOT_FOUND,
			status: HTTPCode.NOT_FOUND,
		});
	}

	public static ownerCannotBeAdded(): ContributorError {
		return new ContributorError({
			code: ContributorsErrorCode.WORKSPACE_OWNER_CANNOT_BE_ADDED_AS_CONTRIBUTOR,
			message:
				ContributorsErrorMessage.WORKSPACE_OWNER_CANNOT_BE_ADDED_AS_CONTRIBUTOR,
			status: HTTPCode.CONFLICT,
		});
	}
}

export { ContributorError };
