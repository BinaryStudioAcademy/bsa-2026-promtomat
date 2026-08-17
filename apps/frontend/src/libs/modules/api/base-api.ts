import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./libs/helpers/base-query.helper.js";

// Single API instance: feature modules attach their own endpoints and cache
// tags with `baseApi.enhanceEndpoints(...).injectEndpoints(...)`.
const baseApi = createApi({
	baseQuery,
	endpoints: () => ({}),
	reducerPath: "api",
	refetchOnReconnect: true,
});

export { baseApi };
