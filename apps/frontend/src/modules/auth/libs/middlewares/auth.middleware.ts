import { type MiddlewareFunction, redirect } from "react-router-dom";

import { AppRoute, ErrorCode } from "~/libs/enums/enums.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { store } from "~/libs/modules/store/store.js";

import { authenticatedUserEndpoint } from "../../auth-api.js";

const authMiddleware: MiddlewareFunction = async (_, next) => {
	const result = store.dispatch(
		authenticatedUserEndpoint.initiate(undefined, { forceRefetch: true }),
	);
	try {
		await result.unwrap();
	} catch (error) {
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
	} finally {
		result.unsubscribe();
	}

	return await next();
};

export { authMiddleware };
