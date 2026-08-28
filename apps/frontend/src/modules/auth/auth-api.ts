import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { UsersApiTag } from "~/modules/users/users.js";

import { AuthApiPath } from "./libs/enums/enums.js";
import {
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
	type UserDto,
} from "./libs/types/types.js";

const authApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getAuthenticatedUser: builder.query<UserDto, undefined>({
				query: () => `${APIPath.AUTH}${AuthApiPath.AUTHENTICATED_USER}`,
			}),
			signIn: builder.mutation<SignInResponseDto, SignInRequestDto>({
				invalidatesTags: [UsersApiTag.USER],
				async onQueryStarted(_, { dispatch, queryFulfilled }) {
					try {
						const { data } = await queryFulfilled;
						await storage.set(StorageKey.TOKEN, data.token);
						await dispatch(
							authApi.util.upsertQueryData(
								"getAuthenticatedUser",
								undefined,
								data.user,
							),
						);
					} catch {
						// The failure is exposed through the mutation error state and rendered by the caller.
					}
				},
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.AUTH}${AuthApiPath.SIGN_IN}`,
				}),
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

const { useGetAuthenticatedUserQuery, useSignInMutation, useSignUpMutation } =
	authApi;

export { useGetAuthenticatedUserQuery, useSignInMutation, useSignUpMutation };
