import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import {
	WorkspacesErrorCode,
	WorkspacesErrorMessage,
} from "../../../modules/workspaces/workspaces.js";
import { ErrorCode } from "../../enums/error-code.enum.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class WorkspaceError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			code,
			message,
			status,
		});
	}

	public static forbidden(): WorkspaceError {
		return new WorkspaceError({
			code: WorkspacesErrorCode.WORKSPACE_ACTION_FORBIDDEN,
			message: WorkspacesErrorMessage.WORKSPACE_ACTION_FORBIDDEN,
			status: HTTPCode.FORBIDDEN,
		});
	}

	public static nameAlreadyExists(): WorkspaceError {
		return new WorkspaceError({
			code: WorkspacesErrorCode.WORKSPACE_ALREADY_EXISTS,
			message: WorkspacesErrorMessage.WORKSPACE_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static notFound(): WorkspaceError {
		return new WorkspaceError({
			code: WorkspacesErrorCode.WORKSPACE_ACCESS_DENIED,
			message: WorkspacesErrorMessage.WORKSPACE_ACCESS_DENIED,
			status: HTTPCode.NOT_FOUND,
		});
	}

	public static ownerCannotBeRemoved(): WorkspaceError {
		return new WorkspaceError({
			code: WorkspacesErrorCode.WORKSPACE_OWNER_CANNOT_BE_REMOVED,
			message: WorkspacesErrorMessage.WORKSPACE_OWNER_CANNOT_BE_REMOVED,
			status: HTTPCode.FORBIDDEN,
		});
	}

	public static userNotFound(): WorkspaceError {
		return new WorkspaceError({
			code: WorkspacesErrorCode.WORKSPACE_USER_NOT_FOUND,
			message: WorkspacesErrorMessage.WORKSPACE_USER_NOT_FOUND,
			status: HTTPCode.NOT_FOUND,
		});
	}
}

export { WorkspaceError };
