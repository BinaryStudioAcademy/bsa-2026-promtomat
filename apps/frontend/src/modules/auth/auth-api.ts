import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { UsersApiTag } from "~/modules/users/users.js";

import { AuthApiPath } from "./libs/enums/enums.js";
import {
	SignInRequestDto,
	SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

const authApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			signIn: builder.mutation<SignInResponseDto, SignInRequestDto>({
				invalidatesTags: [UsersApiTag.USER],
				async onQueryStarted(_, { queryFulfilled }) {
					try {
						const { data } = await queryFulfilled;
						await storage.set(StorageKey.TOKEN, data.token);
						// TODO: seed the authenticated-user cache entry with data.user via upsertQueryData (pm-9)
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

const { useSignInMutation, useSignUpMutation } = authApi;

const { signIn } = authApi.endpoints;

export { signIn, useSignInMutation, useSignUpMutation };
