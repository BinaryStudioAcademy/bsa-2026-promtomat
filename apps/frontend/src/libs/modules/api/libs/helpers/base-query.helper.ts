import { HTTPCode } from "@promptomat/shared";
import {
	type BaseQueryFn,
	type FetchArgs,
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { HTTPHeader } from "~/libs/enums/enums.js";
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
		if (result.error.status === HTTPCode.UNAUTHORIZED) {
			void storage.drop(StorageKey.TOKEN);
		}

		return { error: toServerError(result.error) };
	}

	return result;
};

export { baseQuery };
