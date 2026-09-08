import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { WorkspacesApiPath, WorkspacesApiTag } from "./libs/enums/enums.js";
import {
	type WorkspaceCreateRequestDto,
	type WorkspaceDto,
	type WorkspaceGetAllRequestDto,
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

			deleteWorkspace: builder.mutation<null, number>({
				extraOptions: { shouldSuppressToast: true },
				invalidatesTags: (_result, error) =>
					error === undefined ? [WorkspacesApiTag.WORKSPACE] : [],
				query: (id) => ({
					method: HTTPMethod.DELETE,
					url: configureString(APIPath.WORKSPACES, WorkspacesApiPath.ID, {
						workspaceId: String(id),
					}),
				}),
			}),

			getWorkspaces: builder.query<
				WorkspaceGetAllResponseDto,
				WorkspaceGetAllRequestDto
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
						workspaceId: String(id),
					}),
				}),
			}),
		}),
	});

const {
	useCreateWorkspaceMutation,
	useDeleteWorkspaceMutation,
	useGetWorkspacesQuery,
	useUpdateWorkspaceMutation,
} = workspacesApi;

export {
	useCreateWorkspaceMutation,
	useDeleteWorkspaceMutation,
	useGetWorkspacesQuery,
	useUpdateWorkspaceMutation,
};
