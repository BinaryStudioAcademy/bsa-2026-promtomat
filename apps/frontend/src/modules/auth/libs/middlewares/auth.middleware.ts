import { type MiddlewareFunction, redirect } from "react-router-dom";

import { AppRoute, ErrorCode } from "~/libs/enums/enums.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

import { middleware } from "./middlware.helper.js";

const onError = async (error: unknown) => {
	if (!isServerError(error)) {
		throw error;
	}

	if (error.code === ErrorCode.UNAUTHORIZED) {
		const hasExpiredToken = await storage.has(StorageKey.TOKEN);
		if (hasExpiredToken) {
			await storage.drop(StorageKey.TOKEN);
		}

		throw redirect(AppRoute.SIGN_IN);
	}

	throw new Error(`[${error.code}]: ${error.message}`, { cause: error });
};

const authMiddleware: MiddlewareFunction = (_, next) =>
	middleware(onError, next);

export { authMiddleware };
