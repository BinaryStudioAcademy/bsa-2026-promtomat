import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { AnalyticsApiTag } from "~/modules/analytics/libs/enums/enums.js";
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
	type PromptUpdateBodyRequestDto,
	type PromptUpdateIntentRequestDto,
	type PromptUpdateScoreRequestDto,
	type PromptWorkspaceQueryDto,
} from "./libs/types/types.js";

const promptApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [
			AnalyticsApiTag.ANALYTIC,
			PromptsApiTag.PROMPT,
			WorkspacesApiTag.WORKSPACE,
		],
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
				invalidatesTags: [
					AnalyticsApiTag.ANALYTIC,
					PromptsApiTag.PROMPT,
					WorkspacesApiTag.WORKSPACE,
				],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.PROMPTS}${PromptsApiPath.ROOT}`,
				}),
			}),
			updatePromptBody: builder.mutation<
				PromptDto,
				{
					id: number;
					payload: PromptUpdateBodyRequestDto;
				}
			>({
				async onQueryStarted({ id }, queryLifecycle) {
					try {
						const { data: updatedPrompt } = await queryLifecycle.queryFulfilled;
						const cachedArguments = promptApi.util.selectCachedArgsForQuery(
							queryLifecycle.getState(),
							"getPrompts",
						);

						for (const queryArguments of cachedArguments) {
							queryLifecycle.dispatch(
								promptApi.util.updateQueryData(
									"getPrompts",
									queryArguments,
									(draft) => {
										for (const pageData of draft.pages) {
											const promptToUpdate = pageData.items.find((prompt) => {
												return prompt.id === id;
											});

											if (promptToUpdate) {
												promptToUpdate.body = updatedPrompt.promptBody;
											}
										}
									},
								),
							);
						}

						queryLifecycle.dispatch(
							promptApi.util.updateQueryData("getPromptById", id, (draft) => {
								draft.body = updatedPrompt.promptBody;
							}),
						);
					} catch {
						// The form restores the last persisted body.
					}
				},
				query: ({ id, payload }) => ({
					body: payload,
					method: HTTPMethod.PATCH,
					url: configureString(
						APIPath.PROMPTS,
						PromptsApiPath.$PROMPT_ID_BODY,
						{
							promptId: String(id),
						},
					),
				}),
			}),
			updatePromptScore: builder.mutation<
				PromptDto,
				{
					id: number;
					payload: PromptUpdateScoreRequestDto;
				}
			>({
				invalidatesTags: [AnalyticsApiTag.ANALYTIC, PromptsApiTag.PROMPT],
				async onQueryStarted({ id }, queryLifecycle) {
					try {
						const { data: updatedPrompt } = await queryLifecycle.queryFulfilled;
						const cachedArguments = promptApi.util.selectCachedArgsForQuery(
							queryLifecycle.getState(),
							"getPrompts",
						);

						for (const queryArguments of cachedArguments) {
							queryLifecycle.dispatch(
								promptApi.util.updateQueryData(
									"getPrompts",
									queryArguments,
									(draft) => {
										for (const pageData of draft.pages) {
											const promptToUpdate = pageData.items.find((prompt) => {
												return prompt.id === id;
											});

											if (promptToUpdate) {
												promptToUpdate.score = updatedPrompt.efficiencyScore;
											}
										}
									},
								),
							);
						}

						queryLifecycle.dispatch(
							promptApi.util.updateQueryData("getPromptById", id, (draft) => {
								draft.score = updatedPrompt.efficiencyScore;
							}),
						);
					} catch {
						// The score control keeps the last persisted value.
					}
				},
				query: ({ id, payload }) => ({
					body: payload,
					method: HTTPMethod.PATCH,
					url: configureString(
						APIPath.PROMPTS,
						PromptsApiPath.$PROMPT_ID_SCORE,
						{
							promptId: String(id),
						},
					),
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

						dispatch(
							promptApi.util.updateQueryData("getPromptById", id, (draft) => {
								draft.intent = updatedPrompt.taskIntent;
							}),
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
	useUpdatePromptBodyMutation,
	useUpdatePromptScoreMutation,
	useUpdateTaskIntentMutation,
} = promptApi;

export {
	useGetPromptByIdQuery,
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useGetPromptsInfiniteQuery,
	useRecordPromptMutation,
	useUpdatePromptBodyMutation,
	useUpdatePromptScoreMutation,
	useUpdateTaskIntentMutation,
};
