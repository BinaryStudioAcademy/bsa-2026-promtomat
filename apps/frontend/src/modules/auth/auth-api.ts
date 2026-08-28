import { APIPath, HTTPMethod, ServerErrorType } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { type AppDispatch } from "~/libs/modules/store/store.js";
import { startSession } from "~/modules/auth/libs/services/auth-session.service.js";
import { type UserDto, UsersApiTag } from "~/modules/users/users.js";

import { AuthApiPath, AuthErrorMessage } from "./libs/enums/enums.js";
import {
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";

const authApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getAuthenticatedUser: builder.query<UserDto, undefined>({
				query: () => `${APIPath.AUTH}${AuthApiPath.AUTHENTICATED_USER}`,
			}),
			signUp: builder.mutation<SignUpResponseDto, SignUpRequestDto>({
				invalidatesTags: [UsersApiTag.USER],
				// eslint-disable-next-line max-params -- RTK Query defines queryFn with four positional parameters
				queryFn: async (payload, { dispatch }, _extraOptions, baseQuery) => {
					const appDispatch = dispatch as AppDispatch;
					const result = await baseQuery({
						body: payload,
						method: HTTPMethod.POST,
						url: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}`,
					});
					if (result.error) {
						return { error: result.error };
					}

					const data = result.data as SignUpResponseDto;

					try {
						await startSession({
							cacheAuthenticatedUser: async () => {
								await appDispatch(
									authApi.util.upsertQueryData(
										"getAuthenticatedUser",
										undefined,
										data.user,
									),
								).unwrap();
							},
							token: data.token,
						});
					} catch {
						return {
							error: {
								errorType: ServerErrorType.COMMON,
								message: AuthErrorMessage.SIGN_UP_SESSION_FAILED,
								status: "CUSTOM_ERROR",
							},
						};
					}
					return { data };
				},
			}),
		}),
	});

const { useSignUpMutation } = authApi;

export { useSignUpMutation };
