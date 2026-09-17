import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { WorkspacesApiTag } from "~/modules/workspaces/workspaces.js";

import { PromptsApiPath, PromptsApiTag } from "./libs/enums/enums.js";
import {
	type PromptCreateRequestDto,
	type PromptDto,
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
			getPromptById: builder.query<PromptDto, number>({
				extraOptions: { shouldSuppressToast: true },
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
	useGetPromptByIdQuery,
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useRecordPromptMutation,
	useSearchPromptsQuery,
} = promptApi;

export {
	useGetPromptByIdQuery,
	useGetPromptProgressQuery,
	useGetPromptRecentQuery,
	useRecordPromptMutation,
	useSearchPromptsQuery,
};
