import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { WorkspacesApiTag } from "~/modules/workspaces/workspaces.js";

import { PromptsApiPath, PromptsApiTag } from "./libs/enums/enums.js";
import {
	type PromptCreateRequestDto,
	type PromptDto,
	type PromptGetAllResponseDto,
	type PromptGetQueryDto,
	type PromptGetRecentResponseDto,
	type PromptProgressResponseDto,
	type PromptSearchRequestDto,
	type PromptSearchResponseDto,
	type PromptUpdateIntentRequestDto,
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
				providesTags: [PromptsApiTag.PROMPT],
				query: (queryPayload) => ({
					params: queryPayload,
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
			searchPrompts: builder.query<
				PromptSearchResponseDto,
				PromptSearchRequestDto
			>({
				query: (queryPayload) => ({
					params: queryPayload,
					url: `${APIPath.PROMPTS}${PromptsApiPath.SEARCH}`,
				}),
			}),
			updateTaskIntent: builder.mutation<
				PromptDto,
				{
					id: number;
					payload: PromptUpdateIntentRequestDto;
					queryArgs: PromptGetQueryDto;
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
									const promptToUpdate = draft.items.find(
										(prompt) => prompt.id === id,
									);
									if (promptToUpdate) {
										Object.assign(promptToUpdate, updatedPrompt);
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
					url: configureString(APIPath.PROMPTS, PromptsApiPath.INTENT, {
						promptId: String(id),
					}),
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
	useUpdateTaskIntentMutation,
} = promptApi;

export {
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useGetPromptsQuery,
	useRecordPromptMutation,
	useSearchPromptsQuery,
	useUpdateTaskIntentMutation,
};
