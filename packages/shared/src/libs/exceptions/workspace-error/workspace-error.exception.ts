import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import { WorkspacesErrorMessage } from "../../../modules/workspaces/workspaces.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class WorkspaceError extends HTTPError {
	public constructor({ cause, message, status }: Constructor) {
		super({
			cause,
			message,
			status,
		});

		this.status = status;
	}

	public static nameAlreadyExists(): WorkspaceError {
		return new WorkspaceError({
			message: WorkspacesErrorMessage.WORKSPACE_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static noPersmissionToAccess(): WorkspaceError {
		return new WorkspaceError({
			message: WorkspacesErrorMessage.NO_PERMISSION_TO_ACCESS,
			status: HTTPCode.FORBIDDEN,
		});
	}

	public static notFound(): WorkspaceError {
		return new WorkspaceError({
			message: WorkspacesErrorMessage.NOT_FOUND,
			status: HTTPCode.NOT_FOUND,
		});
	}
}

export { WorkspaceError };
