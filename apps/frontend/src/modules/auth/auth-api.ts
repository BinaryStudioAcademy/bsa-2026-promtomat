import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { type UserDto, UsersApiTag } from "~/modules/users/users.js";

import { AuthApiPath } from "./libs/enums/enums.js";
import {
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

const authApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getAuthenticatedUser: builder.query<UserDto, undefined>({
				providesTags: [UsersApiTag.USER],
				query: () => `${APIPath.AUTH}${AuthApiPath.AUTHENTICATED_USER}`,
			}),
			signIn: builder.mutation<SignInResponseDto, SignInRequestDto>({
				extraOptions: { shouldSuppressToast: true },
				async onQueryStarted(_, { queryFulfilled }) {
					try {
						const { data } = await queryFulfilled;
						await storage.set(StorageKey.TOKEN, data.token);
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
				extraOptions: { shouldSuppressToast: true },
				async onQueryStarted(_payload, { queryFulfilled }) {
					try {
						const { data } = await queryFulfilled;
						await storage.set(StorageKey.TOKEN, data.token);
					} catch {
						// API errors are exposed by the mutation
						// If session setup fails, no user is cached, so navigation is skipped
					}
				},
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}`,
				}),
			}),
		}),
	});

const { useSignInMutation, useSignUpMutation } = authApi;

const { getAuthenticatedUser: authenticatedUserEndpoint } = authApi.endpoints;

export { authenticatedUserEndpoint, useSignInMutation, useSignUpMutation };
