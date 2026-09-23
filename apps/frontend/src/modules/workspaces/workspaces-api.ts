import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { AnalyticsApiTag } from "~/modules/analytics/libs/enums/enums.js";

import { WorkspacesApiPath, WorkspacesApiTag } from "./libs/enums/enums.js";
import {
	type ContributorDto,
	type WorkspaceAddContributorRequestDto,
	type WorkspaceContributorsResponseDto,
	type WorkspaceCreateRequestDto,
	type WorkspaceDto,
	type WorkspaceGetAllRequestDto,
	type WorkspaceGetAllResponseDto,
	type WorkspaceListItemDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";

const workspacesApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [AnalyticsApiTag.ANALYTIC, WorkspacesApiTag.WORKSPACE],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			addWorkspaceContributor: builder.mutation<
				ContributorDto,
				{ payload: WorkspaceAddContributorRequestDto; workspaceId: number }
			>({
				extraOptions: { shouldSuppressToast: true },
				invalidatesTags: (_result, error) => {
					const hasError = Boolean(error);

					return hasError ? [] : [WorkspacesApiTag.WORKSPACE];
				},
				query: ({ payload, workspaceId }) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: configureString(
						APIPath.WORKSPACES_$WORKSPACE_ID,
						WorkspacesApiPath.CONTRIBUTORS,
						{
							workspaceId: String(workspaceId),
						},
					),
				}),
			}),

			createWorkspace: builder.mutation<
				WorkspaceDto,
				WorkspaceCreateRequestDto
			>({
				extraOptions: { shouldSuppressToast: true },
				invalidatesTags: [WorkspacesApiTag.WORKSPACE],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: APIPath.WORKSPACES,
				}),
			}),

			deleteWorkspace: builder.mutation<null, number>({
				invalidatesTags: (_result, error) => {
					const hasError = Boolean(error);

					return hasError
						? []
						: [AnalyticsApiTag.ANALYTIC, WorkspacesApiTag.WORKSPACE];
				},
				query: (id) => ({
					method: HTTPMethod.DELETE,
					url: configureString(
						APIPath.WORKSPACES,
						WorkspacesApiPath.$WORKSPACE_ID,
						{
							workspaceId: String(id),
						},
					),
				}),
			}),

			deleteWorkspaceContributor: builder.mutation<
				null,
				{ userId: number; workspaceId: number }
			>({
				invalidatesTags: (_result, error) => {
					const hasError = Boolean(error);
					return hasError
						? []
						: [AnalyticsApiTag.ANALYTIC, WorkspacesApiTag.WORKSPACE];
				},
				query: ({ userId, workspaceId }) => ({
					method: HTTPMethod.DELETE,
					url: configureString(
						APIPath.WORKSPACES_$WORKSPACE_ID,
						WorkspacesApiPath.CONTRIBUTORS_USER_ID,
						{
							userId: String(userId),
							workspaceId: String(workspaceId),
						},
					),
				}),
			}),

			getWorkspaceById: builder.query<WorkspaceListItemDto, number>({
				extraOptions: { shouldSuppressToast: true },
				providesTags: [WorkspacesApiTag.WORKSPACE],
				query: (workspaceId) => ({
					url: configureString(
						APIPath.WORKSPACES,
						WorkspacesApiPath.$WORKSPACE_ID,
						{
							workspaceId: String(workspaceId),
						},
					),
				}),
			}),

			getWorkspaceContributors: builder.query<
				WorkspaceContributorsResponseDto,
				number
			>({
				providesTags: [WorkspacesApiTag.WORKSPACE],
				query: (workspaceId) => ({
					url: configureString(
						APIPath.WORKSPACES_$WORKSPACE_ID,
						WorkspacesApiPath.CONTRIBUTORS,
						{
							workspaceId: String(workspaceId),
						},
					),
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
					url: configureString(
						APIPath.WORKSPACES,
						WorkspacesApiPath.$WORKSPACE_ID,
						{
							workspaceId: String(id),
						},
					),
				}),
			}),
		}),
	});

const {
	useCreateWorkspaceMutation,
	useDeleteWorkspaceMutation,
	useGetWorkspaceByIdQuery,
	useGetWorkspacesQuery,
	useUpdateWorkspaceMutation,
} = workspacesApi;

export {
	useCreateWorkspaceMutation,
	useDeleteWorkspaceMutation,
	useGetWorkspaceByIdQuery,
	useGetWorkspacesQuery,
	useUpdateWorkspaceMutation,
};
