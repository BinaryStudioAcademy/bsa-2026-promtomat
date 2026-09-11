import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { PromptsApiPath, PromptsApiTag } from "./libs/enums/enums.js";
import {
	type PromptCreateRequestDto,
	type PromptDto,
	type PromptSearchRequestDto,
	type PromptSearchResponseDto,
} from "./libs/types/types.js";

const promptApi = baseApi
	.enhanceEndpoints({ addTagTypes: [PromptsApiTag.PROMPT] })
	.injectEndpoints({
		endpoints: (builder) => ({
			recordPrompt: builder.mutation<PromptDto, PromptCreateRequestDto>({
				invalidatesTags: [PromptsApiTag.PROMPT],
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

const { useRecordPromptMutation, useSearchPromptsQuery } = promptApi;

export { useRecordPromptMutation, useSearchPromptsQuery };
