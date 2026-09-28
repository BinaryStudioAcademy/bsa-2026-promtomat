import { type TypedMutationOnQueryStarted } from "@reduxjs/toolkit/query";

import { type baseApi } from "../../base-api.js";
import { type baseQuery } from "../helpers/base-query.helper.js";

type MutationOnQueryStarted<ResultType, ArgumentType> = NonNullable<
	TypedMutationOnQueryStarted<
		ResultType,
		ArgumentType,
		typeof baseQuery,
		typeof baseApi.reducerPath
	>
>;

export { type MutationOnQueryStarted };
