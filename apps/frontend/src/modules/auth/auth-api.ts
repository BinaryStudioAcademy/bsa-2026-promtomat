import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import {
	UsersApiTag,
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { AuthApiPath } from "./libs/enums/enums.js";

const authApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			signIn: builder.mutation<UserSignInResponseDto, UserSignInRequestDto>({
				invalidatesTags: [UsersApiTag.USER],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.AUTH}${AuthApiPath.SIGN_IN}`,
				}),
			}),
			signUp: builder.mutation<UserSignUpResponseDto, UserSignUpRequestDto>({
				invalidatesTags: [UsersApiTag.USER],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}`,
				}),
			}),
		}),
	});

const { useSignInMutation, useSignUpMutation } = authApi;

export { useSignInMutation, useSignUpMutation };
