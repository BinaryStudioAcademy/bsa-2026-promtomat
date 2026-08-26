import {
	type BaseQueryFn,
	type FetchArgs,
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { HTTPCode, HTTPHeader } from "~/libs/enums/enums.js";
import { config } from "~/libs/modules/config/config.js";
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

		if (error.status === HTTPCode.FORBIDDEN) {
			// TOOD: navigate to AppRoute.No_Access <-- need router
		}

		// TODO task #22 : if(error.status === HTTPCode.UNAUTHORIZED (401)){
		// clean session + redirect sign-in
		// remaining status code
		//}
		return { error };
	}

	return result;
};

export { baseQuery };
