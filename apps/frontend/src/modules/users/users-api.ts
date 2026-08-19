import { APIPath } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { UsersApiPath, UsersApiTag } from "./libs/enums/enums.js";
import { type UserGetAllResponseDto } from "./libs/types/types.js";

const usersApi = baseApi
	.enhanceEndpoints({ addTagTypes: [UsersApiTag.USER] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getUsers: builder.query<UserGetAllResponseDto, undefined>({
				providesTags: [UsersApiTag.USER],
				query: () => `${APIPath.USERS}${UsersApiPath.ROOT}`,
			}),
		}),
	});

const { useGetUsersQuery } = usersApi;

export { useGetUsersQuery };
