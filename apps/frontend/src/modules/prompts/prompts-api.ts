import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
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
	type PromptItemResponseDto,
	type PromptProgressResponseDto,
	type PromptUpdateIntentRequestDto,
	type PromptWorkspaceQueryDto,
} from "./libs/types/types.js";

const promptApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [PromptsApiTag.PROMPT, WorkspacesApiTag.WORKSPACE],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getPromptById: builder.query<PromptItemResponseDto, number>({
				extraOptions: { shouldSuppressToast: true },
				providesTags: [PromptsApiTag.PROMPT],
				query: (id) => ({
					url: configureString(APIPath.PROMPTS, PromptsApiPath.$ID, {
						id: String(id),
					}),
				}),
			}),
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
			updateTaskIntent: builder.mutation<
				PromptDto,
				{
					id: number;
					payload: PromptUpdateIntentRequestDto;
					queryArgs: Omit<PromptGetQueryDto, "page">;
				}
			>({
				async onQueryStarted({ id, queryArgs }, { dispatch, queryFulfilled }) {
					try {
						const { data: updatedPrompt } = await queryFulfilled;

						dispatch(
							promptApi.util.updateQueryData(
								"getPrompts",
								queryArgs,
								(draft) => {
									for (const pageData of draft.pages) {
										const promptToUpdate = pageData.items.find(
											(prompt) => prompt.id === id,
										);
										if (promptToUpdate) {
											promptToUpdate.intent = updatedPrompt.taskIntent;
											break;
										}
									}
								},
							),
						);
					} catch {
						// The UI will naturally handle the error
					}
				},
				query: ({ id, payload }) => ({
					body: payload,
					method: HTTPMethod.PATCH,
					url: configureString(
						APIPath.PROMPTS,
						PromptsApiPath.$PROMPT_ID_INTENT,
						{
							promptId: String(id),
						},
					),
				}),
			}),
		}),
	});

const {
	useGetPromptByIdQuery,
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useGetPromptsInfiniteQuery,
	useRecordPromptMutation,
	useUpdateTaskIntentMutation,
} = promptApi;

export {
	useGetPromptByIdQuery,
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useGetPromptsInfiniteQuery,
	useRecordPromptMutation,
	useUpdateTaskIntentMutation,
};
