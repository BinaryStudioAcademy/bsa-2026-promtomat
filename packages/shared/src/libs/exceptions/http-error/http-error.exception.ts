import { type HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import { ApplicationError } from "../application-error/application-error.exception.js";

type Constructor = {
	cause?: unknown;
	code?: string;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class HTTPError extends ApplicationError {
	public code: string | undefined;

	public status: ValueOf<typeof HTTPCode>;

	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			message,
		});

		this.code = code;
		this.status = status;
	}
}

export { HTTPError };
