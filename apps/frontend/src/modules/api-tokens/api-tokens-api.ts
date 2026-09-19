import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { ApiTokensApiTag, TokenApiPath } from "./libs/enums/enums.js";
import {
	type ApiTokenDto,
	type ApiTokenRequestDto,
	type ApiTokenResponseDto,
} from "./libs/types/types.js";

const apiTokensApi = baseApi
	.enhanceEndpoints({ addTagTypes: [ApiTokensApiTag.API_TOKEN] })
	.injectEndpoints({
		endpoints: (builder) => ({
			createApiToken: builder.mutation<ApiTokenResponseDto, ApiTokenRequestDto>(
				{
					extraOptions: { shouldSuppressToast: true },
					invalidatesTags: [ApiTokensApiTag.API_TOKEN],
					query: (payload) => ({
						body: payload,
						method: HTTPMethod.POST,
						url: APIPath.API_TOKENS,
					}),
				},
			),

			getApiTokens: builder.query<ApiTokenDto[], undefined>({
				providesTags: [ApiTokensApiTag.API_TOKEN],
				query: () => ({
					url: APIPath.API_TOKENS,
				}),
			}),

			revokeApiToken: builder.mutation<null, string>({
				extraOptions: { shouldSuppressToast: true },
				invalidatesTags: (_result, error) => {
					const hasError = Boolean(error);

					return hasError ? [] : [ApiTokensApiTag.API_TOKEN];
				},
				query: (id) => ({
					method: HTTPMethod.DELETE,
					url: configureString(APIPath.API_TOKENS, TokenApiPath.REVOKE, {
						id,
					}),
				}),
			}),
		}),
	});

const {
	useCreateApiTokenMutation,
	useGetApiTokensQuery,
	useRevokeApiTokenMutation,
} = apiTokensApi;

export {
	useCreateApiTokenMutation,
	useGetApiTokensQuery,
	useRevokeApiTokenMutation,
};
