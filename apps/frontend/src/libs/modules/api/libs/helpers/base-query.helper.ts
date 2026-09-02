import {
	type BaseQueryFn,
	type FetchArgs,
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { AppRoute, ErrorCode, HTTPHeader } from "~/libs/enums/enums.js";
import { config } from "~/libs/modules/config/config.js";
import { setRedirect } from "~/libs/modules/navigation/navigation.slice.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

import { type BaseQueryExtraOptions } from "../types/base-query-extra-options.type.js";
import { type ServerError } from "../types/server-error.type.js";
import { toServerError } from "./to-server-error.helper.js";

type BaseQueryFunctionInternal = BaseQueryFn<
	FetchArgs | string,
	unknown,
	ServerError,
	BaseQueryExtraOptions | undefined
>;

const fetchQuery = fetchBaseQuery({
	baseUrl: config.ENV.API.ORIGIN_URL,
	prepareHeaders: async (headers) => {
		const token = await storage.get(StorageKey.TOKEN);

		if (token) {
			headers.set(HTTPHeader.AUTHORIZATION, `Bearer ${token}`);
		}

		return headers;
	},
});

const baseQuery: BaseQueryFunctionInternal = async (
	arguments_,
	api,
	extraOptions,
) => {
	const result = await fetchQuery(arguments_, api, extraOptions ?? {});

	if (!result.error) {
		return result;
	}

	const error = toServerError(result.error);

	switch (error.code) {
		case ErrorCode.FORBIDDEN: {
			showNotification({
				id: error.code,
				message: error.message,
				type: "error",
			});
			api.dispatch(setRedirect(AppRoute.NO_ACCESS));

			return { error };
		}

		case ErrorCode.INTERNAL_SERVER_ERROR: {
			showNotification({
				id: error.code,
				message: error.message,
				type: "error",
			});

			return { error };
		}

		case ErrorCode.UNAUTHENTICATED: {
			const hasExpiredToken = await storage.has(StorageKey.TOKEN);

			await storage.drop(StorageKey.TOKEN);

			if (hasExpiredToken) {
				showNotification({
					id: error.code,
					message: error.message,
					type: "error",
				});
			}

			api.dispatch(setRedirect(AppRoute.SIGN_IN));

			return { error };
		}

		case ErrorCode.VALIDATION_FAILED: {
			return { error };
		}

		default: {
			if (extraOptions?.shouldSuppressToast !== true) {
				showNotification({
					id: error.code,
					message: error.message,
					type: "error",
				});
			}

			return { error };
		}
	}
};

export { baseQuery };
