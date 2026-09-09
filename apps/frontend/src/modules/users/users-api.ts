import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { UsersApiPath, UsersApiTag } from "./libs/enums/enums.js";
import {
	type UserDto,
	type UserGetAllResponseDto,
	type UserProfileSummaryResponseDto,
	type UserUpdateRequestDto,
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
			updateProfile: builder.mutation<UserDto, UserUpdateRequestDto>({
				invalidatesTags: [UsersApiTag.USER],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.PATCH,
					url: `${APIPath.USERS}${UsersApiPath.ME}`,
				}),
			}),
		}),
	});

const { useGetProfileSummaryQuery, useGetUsersQuery, useUpdateProfileMutation } =
	usersApi;

export {
	useGetProfileSummaryQuery,
	useGetUsersQuery,
	useUpdateProfileMutation,
};
