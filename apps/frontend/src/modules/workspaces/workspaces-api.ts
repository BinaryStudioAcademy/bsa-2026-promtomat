import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { WorkspacesApiPath, WorkspacesApiTag } from "./libs/enums/enums.js";
import {
	type ContributorDto,
	type WorkspaceAddContributorRequestDto,
	type WorkspaceContributorCandidatesResponseDto,
	type WorkspaceContributorsResponseDto,
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
			addWorkspaceContributor: builder.mutation<
				ContributorDto,
				{ payload: WorkspaceAddContributorRequestDto; workspaceId: number }
			>({
				invalidatesTags: (_result, error) => {
					const hasError = Boolean(error);

					return hasError ? [] : [WorkspacesApiTag.WORKSPACE];
				},
				query: ({ payload, workspaceId }) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: configureString(
						APIPath.WORKSPACES,
						WorkspacesApiPath.$WORKSPACE_ID_CONTRIBUTORS,
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

					return hasError ? [] : [WorkspacesApiTag.WORKSPACE];
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
					return hasError ? [] : [WorkspacesApiTag.WORKSPACE];
				},
				query: ({ userId, workspaceId }) => ({
					method: HTTPMethod.DELETE,
					url: configureString(
						APIPath.WORKSPACES,
						WorkspacesApiPath.$WORKSPACE_ID_CONTRIBUTORS_USER_ID,
						{
							userId: String(userId),
							workspaceId: String(workspaceId),
						},
					),
				}),
			}),
			getWorkspaceContributorCandidates: builder.infiniteQuery<
				WorkspaceContributorCandidatesResponseDto,
				{ userQuery: string; workspaceId: number },
				null | string
			>({
				infiniteQueryOptions: {
					getNextPageParam: (lastPage) => lastPage.nextCursor,
					initialPageParam: null,
				},
				providesTags: [WorkspacesApiTag.WORKSPACE],
				query: ({ pageParam, queryArg }) => ({
					params: {
						cursor: pageParam ?? undefined,
						userQuery: queryArg.userQuery,
					},
					url: configureString(
						APIPath.WORKSPACES,
						WorkspacesApiPath.$WORKSPACE_ID_CONTRIBUTOR_CANDIDATES,
						{
							workspaceId: String(queryArg.workspaceId),
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
						APIPath.WORKSPACES,
						WorkspacesApiPath.$WORKSPACE_ID_CONTRIBUTORS,
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
	useAddWorkspaceContributorMutation,
	useCreateWorkspaceMutation,
	useDeleteWorkspaceContributorMutation,
	useDeleteWorkspaceMutation,
	useGetWorkspaceContributorCandidatesInfiniteQuery,
	useGetWorkspaceContributorsQuery,
	useGetWorkspacesQuery,
	useUpdateWorkspaceMutation,
} = workspacesApi;

export {
	useAddWorkspaceContributorMutation,
	useCreateWorkspaceMutation,
	useDeleteWorkspaceContributorMutation,
	useDeleteWorkspaceMutation,
	useGetWorkspaceContributorCandidatesInfiniteQuery,
	useGetWorkspaceContributorsQuery,
	useGetWorkspacesQuery,
	useUpdateWorkspaceMutation,
};
