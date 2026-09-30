import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { type MutationOnQueryStarted } from "~/libs/modules/api/libs/types/mutation-on-query-started.type.js";
import { AnalyticsApiTag } from "~/modules/analytics/libs/enums/enums.js";
import { type PromptHistoryGetQueryDto } from "~/modules/prompt-history/libs/types/types.js";
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
	type PromptGetRecentResponseDto,
	type PromptItemResponseDto,
	type PromptStreakQueryDto,
	type PromptStreakResponseDto,
	type PromptUpdateBodyRequestDto,
	type PromptUpdateIntentRequestDto,
	type PromptUpdateScoreRequestDto,
	type PromptWorkspaceQueryDto,
} from "./libs/types/types.js";

const createPatchCachedPrompt = (
	patch: (prompt: PromptItemResponseDto, updatedPrompt: PromptDto) => void,
): MutationOnQueryStarted<PromptDto, { id: number }> => {
	return async ({ id }, queryLifecycle) => {
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
								const cachedPrompt = pageData.items.find(
									(item) => item.id === id,
								);

								if (cachedPrompt) {
									patch(cachedPrompt, updatedPrompt);
								}
							}
						},
					),
				);
			}

			queryLifecycle.dispatch(
				promptApi.util.updateQueryData("getPromptById", id, (draft) => {
					patch(draft, updatedPrompt);
				}),
			);
		} catch {
			// The control that issued the mutation keeps the last persisted value.
		}
	};
};

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
				Omit<PromptHistoryGetQueryDto, "page">,
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
					url: APIPath.PROMPT_HISTORY,
				}),
			}),
			getPromptStreak: builder.query<
				PromptStreakResponseDto,
				PromptStreakQueryDto
			>({
				providesTags: [PromptsApiTag.PROMPT],
				query: ({ timeZone }) => ({
					params: { timeZone },
					url: `${APIPath.PROMPTS}${PromptsApiPath.STREAK}`,
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
				onQueryStarted: createPatchCachedPrompt((prompt, updatedPrompt) => {
					prompt.body = updatedPrompt.promptBody;
				}),
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
				onQueryStarted: createPatchCachedPrompt((prompt, updatedPrompt) => {
					prompt.score = updatedPrompt.efficiencyScore;
				}),
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
				}
			>({
				onQueryStarted: createPatchCachedPrompt((prompt, updatedPrompt) => {
					prompt.intent = updatedPrompt.taskIntent;
				}),
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
	useGetPromptRecentQuery,
	useGetPromptsInfiniteQuery,
	useGetPromptStreakQuery,
	useRecordPromptMutation,
	useUpdatePromptBodyMutation,
	useUpdateTaskIntentMutation,
} = promptApi;

export {
	useGetPromptByIdQuery,
	useGetPromptRecentQuery,
	useGetPromptsInfiniteQuery,
	useGetPromptStreakQuery,
	useRecordPromptMutation,
	useUpdatePromptBodyMutation,
	useUpdateTaskIntentMutation,
};
