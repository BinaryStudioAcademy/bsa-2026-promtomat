import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import {
	RepositoryBindingsApiPath,
	RepositoryBindingsApiTag,
} from "./libs/enums/enums.js";
import { type RepositoryBindingDto } from "./libs/types/types.js";

const repositoryBindingsApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [RepositoryBindingsApiTag.REPOSITORY_BINDING],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			deleteRepositoryBinding: builder.mutation<null, number>({
				invalidatesTags: (_result, error) => {
					const hasError = Boolean(error);

					return hasError ? [] : [RepositoryBindingsApiTag.REPOSITORY_BINDING];
				},
				query: (id) => ({
					method: HTTPMethod.DELETE,
					url: configureString(
						APIPath.REPOSITORY_BINDINGS,
						RepositoryBindingsApiPath.$REPOSITORY_BINDING_ID,
						{
							repositoryBindingId: String(id),
						},
					),
				}),
			}),

			getRepositoryBindings: builder.query<RepositoryBindingDto[], number>({
				providesTags: [RepositoryBindingsApiTag.REPOSITORY_BINDING],
				query: (workspaceId) => ({
					params: { workspaceId },
					url: APIPath.REPOSITORY_BINDINGS,
				}),
			}),
		}),
	});

const { useDeleteRepositoryBindingMutation, useGetRepositoryBindingsQuery } =
	repositoryBindingsApi;

export { useDeleteRepositoryBindingMutation, useGetRepositoryBindingsQuery };
