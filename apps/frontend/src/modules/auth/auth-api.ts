import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { UsersApiTag } from "~/modules/users/users.js";

import { AuthApiPath } from "./libs/enums/enums.js";
import {
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

const authApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getAuthenticatedUser: builder.query<SignUpResponseDto, undefined>({
				providesTags: [UsersApiTag.USER],
				query: () => `${APIPath.AUTH}${AuthApiPath.AUTHENTICATED_USER}`,
			}),
			signUp: builder.mutation<SignUpResponseDto, SignUpRequestDto>({
				invalidatesTags: [UsersApiTag.USER],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}`,
				}),
			}),
		}),
	});

const { useGetAuthenticatedUserQuery, useSignUpMutation } = authApi;

export { useGetAuthenticatedUserQuery, useSignUpMutation };
