import { APIPath } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { UsersApiPath, UsersApiTag } from "./libs/enums/enums.js";
import {
	type UserGetAllResponseDto,
	type UserProfileSummaryResponseDto,
} from "./libs/types/types.js";

const usersApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getProfileSummary: builder.query<
				UserProfileSummaryResponseDto,
				undefined
			>({
				providesTags: [UsersApiTag.USER],
				query: () => `${APIPath.USERS}${UsersApiPath.ME_SUMMARY}`,
			}),
			getUsers: builder.query<UserGetAllResponseDto, undefined>({
				providesTags: [UsersApiTag.USER],
				query: () => `${APIPath.USERS}${UsersApiPath.ROOT}`,
			}),
		}),
	});

const { useGetProfileSummaryQuery, useGetUsersQuery } = usersApi;

export { useGetProfileSummaryQuery, useGetUsersQuery };
