import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import {
	ComposedPromptsApiPath,
	ComposedPromptsApiTag,
} from "./libs/enums/enums.js";
import { getComposedPromptsTags } from "./libs/helpers/helpers.js";
import {
	type ComposedPromptDto,
	type ComposedPromptGetAllResponseDto,
	type ComposedPromptGetQueryDto,
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
					url: `${APIPath.COMPOSED_PROMPTS}${ComposedPromptsApiPath.ROOT}`,
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
			getComposedPrompts: builder.query<
				ComposedPromptGetAllResponseDto,
				ComposedPromptGetQueryDto
			>({
				providesTags: getComposedPromptsTags,
				query: (parameters) => ({
					method: HTTPMethod.GET,
					params: parameters,
					url: `${APIPath.COMPOSED_PROMPTS}${ComposedPromptsApiPath.ROOT}`,
				}),
			}),
		}),
	});

const {
	useComposeMutation,
	useGetComposedPromptByIdQuery,
	useGetComposedPromptsQuery,
} = composedPromptApi;

export {
	useComposeMutation,
	useGetComposedPromptByIdQuery,
	useGetComposedPromptsQuery,
};
