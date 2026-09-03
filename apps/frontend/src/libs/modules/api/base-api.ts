import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./libs/helpers/base-query.helper.js";

const baseApi = createApi({
	baseQuery,
	endpoints: () => ({}),
	reducerPath: "api",
	refetchOnReconnect: true,
});

export { baseApi };
