import {
	UnexpectedResponseError,
	UnreachableError,
} from "~/libs/exceptions/exceptions.js";

import { type ValidationSchema } from "../types/types.js";
import { getUnreachableReason } from "./get-unreachable-reason.helper.js";

const readJson = async (response: Response): Promise<unknown> => {
	try {
		return await response.json();
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new UnexpectedResponseError({ status: response.status });
		}

		throw new UnreachableError({
			cause: error,
			message: getUnreachableReason(error),
		});
	}
};

const parseResponseBody = async <T>(
	response: Response,
	validationSchema: ValidationSchema<T>,
): Promise<T> => {
	const result = validationSchema.safeParse(await readJson(response));

	if (!result.success) {
		throw new UnexpectedResponseError({
			cause: result.error,
			status: response.status,
		});
	}

	return result.data;
};

export { parseResponseBody };
