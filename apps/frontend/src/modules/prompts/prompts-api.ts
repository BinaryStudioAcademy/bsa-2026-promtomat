import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { WorkspacesApiTag } from "~/modules/workspaces/workspaces.js";

import { PromptsApiPath, PromptsApiTag } from "./libs/enums/enums.js";
import {
	type PromptCreateRequestDto,
	type PromptDto,
	type PromptGetAllResponseDto,
	type PromptGetQueryDto,
} from "./libs/types/types.js";

const promptApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [PromptsApiTag.PROMPT, WorkspacesApiTag.WORKSPACE],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getPrompts: builder.query<PromptGetAllResponseDto, PromptGetQueryDto>({
				providesTags: [PromptsApiTag.PROMPT],
				query: (queryPayload) => ({
					params: queryPayload,
					url: `${APIPath.PROMPTS}${PromptsApiPath.ROOT}`,
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

const { useGetPromptsQuery, useRecordPromptMutation } = promptApi;

export { useGetPromptsQuery, useRecordPromptMutation };
