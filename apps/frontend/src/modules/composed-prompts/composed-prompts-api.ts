import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { ComposedPromptsApiPath } from "./libs/enums/enums.js";
import {
	type ComposeRequestDto,
	type ComposeResponseDto,
} from "./libs/types/types.js";

const composedPromptApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		compose: builder.mutation<ComposeResponseDto, ComposeRequestDto>({
			query: (payload) => ({
				body: payload,
				method: HTTPMethod.POST,
				url: `${APIPath.COMPOSED_PROMPTS}${ComposedPromptsApiPath.ROOT}`,
			}),
		}),
	}),
});

const { useComposeMutation } = composedPromptApi;

export { useComposeMutation };
