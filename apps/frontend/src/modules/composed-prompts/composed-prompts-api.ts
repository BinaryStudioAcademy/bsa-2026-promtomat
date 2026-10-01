import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { ComposedPromptsApiTag } from "./libs/enums/enums.js";
import {
	type ComposedPromptDto,
	type ComposeRequestDto,
	type ComposeResponseDto,
} from "./libs/types/types.js";

const composedPromptApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [ComposedPromptsApiTag.COMPOSED_PROMPT],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			compose: builder.mutation<ComposeResponseDto, ComposeRequestDto>({
				invalidatesTags: [ComposedPromptsApiTag.COMPOSED_PROMPT],
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: APIPath.COMPOSED_PROMPTS,
				}),
			}),
			getComposedPromptById: builder.query<ComposedPromptDto, number>({
				providesTags: (_result, _error, id) => [
					{ id, type: ComposedPromptsApiTag.COMPOSED_PROMPT },
				],
				query: (id) => ({
					method: HTTPMethod.GET,
					url: `${APIPath.COMPOSED_PROMPTS}/${String(id)}`,
				}),
			}),
		}),
	});

const { useComposeMutation, useGetComposedPromptByIdQuery } = composedPromptApi;

export { useComposeMutation, useGetComposedPromptByIdQuery };
