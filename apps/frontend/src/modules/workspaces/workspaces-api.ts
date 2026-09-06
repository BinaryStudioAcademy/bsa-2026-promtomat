import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { WorkspacesApiTag } from "./libs/enums/enums.js";
import {
	type WorkspaceCreateRequestDto,
	type WorkspaceDto,
	type WorkspaceGetAllResponseDto,
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
		}),
	});

const { useCreateWorkspaceMutation, useGetWorkspacesQuery } = workspacesApi;

export { useCreateWorkspaceMutation, useGetWorkspacesQuery };
