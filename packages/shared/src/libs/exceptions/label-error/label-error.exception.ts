import { HTTPCode } from "../../../libs/modules/http/http.js";
import { type ValueOf } from "../../../libs/types/value-of.type.js";
import {
	LabelsErrorCode,
	LabelsErrorMessage,
} from "../../../modules/labels/labels.js";
import { ErrorCode } from "../../enums/error-code.enum.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: ValueOf<typeof HTTPCode>;
};

class LabelError extends HTTPError {
	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			code,
			message,
			status,
		});
	}

	public static unusableName(cause?: unknown): LabelError {
		return new LabelError({
			cause,
			code: LabelsErrorCode.UNUSABLE_NAME,
			message: LabelsErrorMessage.UNUSABLE_NAME,
			status: HTTPCode.UNPROCESSED_ENTITY,
		});
	}
}

export { LabelError };
