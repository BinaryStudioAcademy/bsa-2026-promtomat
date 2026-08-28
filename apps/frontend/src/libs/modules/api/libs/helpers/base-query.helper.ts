import {
	type BaseQueryFn,
	type FetchArgs,
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { AppRoute, HTTPCode, HTTPHeader } from "~/libs/enums/enums.js";
import { config } from "~/libs/modules/config/config.js";
import { setRedirect } from "~/libs/modules/navigation/navigation.slice.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

import { type ServerError } from "../types/server-error.type.js";
import { toServerError } from "./to-server-error.helper.js";

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

const baseQuery: BaseQueryFn<FetchArgs | string, unknown, ServerError> = async (
	arguments_,
	api,
	extraOptions,
) => {
	const result = await fetchQuery(arguments_, api, extraOptions);
  
	if (result.error) {
		const error = toServerError(result.error);

		if (error.status === HTTPCode.UNAUTHORIZED) {
			await storage.drop(StorageKey.TOKEN);
    // TODO task #22: redirect to sign-in after clearing the session,
		// plus the remaining status codes.
		}

		if (error.status === HTTPCode.FORBIDDEN) {
			api.dispatch(setRedirect(AppRoute.NO_ACCESS));
		}

		
		return { error };
	}

	return result;
};

export { baseQuery };
