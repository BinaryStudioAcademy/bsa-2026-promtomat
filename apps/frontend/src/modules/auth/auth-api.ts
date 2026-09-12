import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { type UserDto, UsersApiTag } from "~/modules/users/users.js";

import { AuthApiPath } from "./libs/enums/enums.js";
import {
	type ForgotPasswordRequestDto,
	type ResetPasswordRequestDto,
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

const authApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			forgotPassword: builder.mutation<null, ForgotPasswordRequestDto>({
				extraOptions: { shouldSuppressToast: true },
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.AUTH}${AuthApiPath.FORGOT_PASSWORD}`,
				}),
			}),
			getAuthenticatedUser: builder.query<UserDto, undefined>({
				providesTags: [UsersApiTag.USER],
				query: () => `${APIPath.AUTH}${AuthApiPath.AUTHENTICATED_USER}`,
			}),
			resetPassword: builder.mutation<null, ResetPasswordRequestDto>({
				extraOptions: { shouldSuppressToast: true },
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.AUTH}${AuthApiPath.RESET_PASSWORD}`,
				}),
			}),
			signIn: builder.mutation<SignInResponseDto, SignInRequestDto>({
				extraOptions: { shouldSuppressToast: true },
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
				extraOptions: { shouldSuppressToast: true },
				async onQueryStarted(_payload, { dispatch, queryFulfilled }) {
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

const {
	useForgotPasswordMutation,
	useGetAuthenticatedUserQuery,
	useResetPasswordMutation,
	useSignInMutation,
	useSignUpMutation,
} = authApi;

export {
	useForgotPasswordMutation,
	useGetAuthenticatedUserQuery,
	useResetPasswordMutation,
	useSignInMutation,
	useSignUpMutation,
};
