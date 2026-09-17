import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import {
	RepositoryBindingsErrorCode,
	RepositoryBindingsErrorMessage,
} from "../../../modules/repository-bindings/repository-bindings.js";
import { ErrorCode } from "../../enums/error-code.enum.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class RepositoryBindingError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			code,
			message,
			status,
		});
	}

	public static alreadyExists(): RepositoryBindingError {
		return new RepositoryBindingError({
			code: RepositoryBindingsErrorCode.REPOSITORY_BINDING_ALREADY_EXISTS,
			message: RepositoryBindingsErrorMessage.REPOSITORY_BINDING_ALREADY_EXISTS,
			status: HTTPCode.CONFLICT,
		});
	}

	public static noRemoteConfigured(): RepositoryBindingError {
		return new RepositoryBindingError({
			code: RepositoryBindingsErrorCode.NO_REMOTE_CONFIGURED,
			message: RepositoryBindingsErrorMessage.NO_REMOTE_CONFIGURED,
			status: HTTPCode.UNPROCESSED_ENTITY,
		});
	}

	public static unrecognizedFormat(): RepositoryBindingError {
		return new RepositoryBindingError({
			code: RepositoryBindingsErrorCode.UNRECOGNIZED_REPOSITORY_FORMAT,
			message: RepositoryBindingsErrorMessage.UNRECOGNIZED_REPOSITORY_FORMAT,
			status: HTTPCode.UNPROCESSED_ENTITY,
		});
	}
}

export { RepositoryBindingError };
