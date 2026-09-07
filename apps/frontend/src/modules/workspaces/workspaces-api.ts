import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { WorkspacesApiPath, WorkspacesApiTag } from "./libs/enums/enums.js";
import {
	type WorkspaceCreateRequestDto,
	type WorkspaceDto,
	type WorkspaceGetAllResponseDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";

const workspacesApi = baseApi
	.enhanceEndpoints({ addTagTypes: [WorkspacesApiTag.WORKSPACE] })
	.injectEndpoints({
		endpoints: (builder) => ({
			createWorkspace: builder.mutation<
				WorkspaceDto,
				WorkspaceCreateRequestDto
			>({
				invalidatesTags: [WorkspacesApiTag.WORKSPACE],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: APIPath.WORKSPACES,
				}),
			}),

			getWorkspaces: builder.query<
				WorkspaceGetAllResponseDto,
				{ workspaceName?: string }
			>({
				providesTags: [WorkspacesApiTag.WORKSPACE],
				query: (queryPayload) => ({
					params: queryPayload,
					url: APIPath.WORKSPACES,
				}),
			}),

			updateWorkspace: builder.mutation<
				WorkspaceDto,
				{ id: number; payload: WorkspaceUpdateRequestDto }
			>({
				extraOptions: { shouldSuppressToast: true },
				invalidatesTags: [WorkspacesApiTag.WORKSPACE],
				query: ({ id, payload }) => ({
					body: payload,
					method: HTTPMethod.PATCH,
					url: configureString(APIPath.WORKSPACES, WorkspacesApiPath.ID, {
						id: String(id),
					}),
				}),
			}),
		}),
	});

const {
	useCreateWorkspaceMutation,
	useGetWorkspacesQuery,
	useUpdateWorkspaceMutation,
} = workspacesApi;

export {
	useCreateWorkspaceMutation,
	useGetWorkspacesQuery,
	useUpdateWorkspaceMutation,
};
