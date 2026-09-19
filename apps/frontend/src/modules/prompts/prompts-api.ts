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
			getPrompts: builder.infiniteQuery<
				PromptGetAllResponseDto,
				Omit<PromptGetQueryDto, "page">,
				number
			>({
				infiniteQueryOptions: {
					getNextPageParam: (lastPage, _allPages, lastPageParameter) => {
						const isLastPage =
							lastPageParameter * PaginationValue.DEFAULT_LIMIT >=
							lastPage.totalCount;

						return isLastPage
							? undefined
							: lastPageParameter + PaginationValue.DEFAULT_OFFSET;
					},
					initialPageParam: PaginationValue.DEFAULT_PAGE,
				},
				providesTags: [PromptsApiTag.PROMPT],
				query: ({ pageParam, queryArg }) => ({
					params: { ...queryArg, page: pageParam },
					url: APIPath.PROMPTS,
				}),
			}),
			recordPrompt: builder.mutation<PromptDto, PromptCreateRequestDto>({
				invalidatesTags: [PromptsApiTag.PROMPT, WorkspacesApiTag.WORKSPACE],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.PROMPTS}${PromptsApiPath.ROOT}`,
				}),
			}),
		}),
	});

const {
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useGetPromptsInfiniteQuery,
	useRecordPromptMutation,
} = promptApi;

export {
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useGetPromptsInfiniteQuery,
	useRecordPromptMutation,
};
