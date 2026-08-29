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

type EstablishAuthenticatedSessionOptions = {
	dispatch: AppDispatch;
	token: string;
	user: UserDto;
};

const authApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getAuthenticatedUser: builder.query<UserDto, undefined>({
				providesTags: [UsersApiTag.USER],
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
						await establishAuthenticatedSession({
							dispatch: appDispatch,
							token: data.token,
							user: data.user,
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

const updateAuthenticatedUserCache = async (
	dispatch: AppDispatch,
	user: UserDto,
): Promise<void> => {
	await dispatch(
		authApi.util.upsertQueryData("getAuthenticatedUser", undefined, user),
	).unwrap();
};

const establishAuthenticatedSession = async ({
	dispatch,
	token,
	user,
}: EstablishAuthenticatedSessionOptions): Promise<void> => {
	await startSession({
		cacheAuthenticatedUser: () => updateAuthenticatedUserCache(dispatch, user),
		token,
	});
};

const { useGetAuthenticatedUserQuery, useSignUpMutation } = authApi;

export { useGetAuthenticatedUserQuery, useSignUpMutation };
