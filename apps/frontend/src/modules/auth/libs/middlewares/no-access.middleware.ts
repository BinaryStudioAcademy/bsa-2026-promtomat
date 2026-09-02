import { type MiddlewareFunction, redirect } from "react-router-dom";

import { AppRoute, ErrorCode } from "~/libs/enums/enums.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";

import { middleware } from "./middlware.helper.js";

const onError = (error: unknown) => {
	if (!isServerError(error)) {
		throw error;
	}

	if (error.code === ErrorCode.FORBIDDEN) {
		throw redirect(AppRoute.NO_ACCESS);
	}

	throw new Error(`[${error.code}]: ${error.message}`, { cause: error });
};

const noAccessMiddleware: MiddlewareFunction = (_, next) =>
	middleware(onError, next);

export { noAccessMiddleware };
