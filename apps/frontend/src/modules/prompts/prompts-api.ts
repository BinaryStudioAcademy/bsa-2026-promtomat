import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { WorkspacesApiTag } from "~/modules/workspaces/workspaces.js";

import {
	PaginationValue,
	PromptsApiPath,
	PromptsApiTag,
} from "./libs/enums/enums.js";
import {
	type PromptCreateRequestDto,
	type PromptDto,
	type PromptGetAllResponseDto,
	type PromptGetQueryDto,
	type PromptGetRecentResponseDto,
	type PromptProgressResponseDto,
	type PromptSearchRequestDto,
	type PromptSearchResponseDto,
	type PromptWorkspaceQueryDto,
} from "./libs/types/types.js";

const promptApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [PromptsApiTag.PROMPT, WorkspacesApiTag.WORKSPACE],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getPromptProgress: builder.query<
				PromptProgressResponseDto,
				PromptWorkspaceQueryDto
			>({
				providesTags: [PromptsApiTag.PROMPT],
				query: ({ workspaceId }) => ({
					params: { workspaceId },
					url: `${APIPath.PROMPTS}${PromptsApiPath.PROGRESS}`,
				}),
			}),
			getPromptRecent: builder.query<
				PromptGetRecentResponseDto,
				PromptWorkspaceQueryDto
			>({
				providesTags: [PromptsApiTag.PROMPT],
				query: ({ workspaceId }) => ({
					params: { workspaceId },
					url: `${APIPath.PROMPTS}${PromptsApiPath.RECENT}`,
				}),
			}),
			getPrompts: builder.query<PromptGetAllResponseDto, PromptGetQueryDto>({
				forceRefetch: ({ currentArg, previousArg }) => {
					return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
				},
				merge: (currentCache, newResponse, { arg }) => {
					if (arg.page === PaginationValue.DEFAULT_PAGE) {
						return newResponse;
					}

					currentCache.items.push(...newResponse.items);
					currentCache.totalCount = newResponse.totalCount;
					currentCache.averageScore = newResponse.averageScore;
					currentCache.page = newResponse.page;
				},
				providesTags: [PromptsApiTag.PROMPT],
				query: (queryPayload) => ({
					params: queryPayload,
					url: APIPath.PROMPTS,
				}),
				serializeQueryArgs: ({ endpointName, queryArgs }) => {
					const filters = Object.fromEntries(
						Object.entries(queryArgs).filter(([key]) => key !== "page"),
					);
					return `${endpointName}-${JSON.stringify(filters)}`;
				},
			}),
			recordPrompt: builder.mutation<PromptDto, PromptCreateRequestDto>({
				invalidatesTags: [PromptsApiTag.PROMPT, WorkspacesApiTag.WORKSPACE],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.PROMPTS}${PromptsApiPath.ROOT}`,
				}),
			}),
			searchPrompts: builder.query<
				PromptSearchResponseDto,
				PromptSearchRequestDto
			>({
				query: (queryPayload) => ({
					params: queryPayload,
					url: `${APIPath.PROMPTS}${PromptsApiPath.SEARCH}`,
				}),
			}),
		}),
	});

const {
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useGetPromptsQuery,
	useRecordPromptMutation,
	useSearchPromptsQuery,
} = promptApi;

export {
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useGetPromptsQuery,
	useRecordPromptMutation,
	useSearchPromptsQuery,
};
