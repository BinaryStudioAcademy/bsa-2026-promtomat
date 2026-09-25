import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { ComposedPromptsApiTag } from "~/modules/composed-prompts/libs/enums/enums.js";
import { PromptsApiTag } from "~/modules/prompts/libs/enums/enums.js";

import { EvaluationsApiPath } from "./libs/enums/enums.js";
import {
	type EvaluationCreateRequestDto,
	type EvaluationResponseDto,
} from "./libs/types/types.js";

const evaluationApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [PromptsApiTag.PROMPT, ComposedPromptsApiTag.COMPOSED_PROMPT],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			evaluate: builder.mutation<
				EvaluationResponseDto,
				EvaluationCreateRequestDto
			>({
				invalidatesTags: (result) => {
					if (!result) {
						return [];
					}

					if (result.targetType === "prompt") {
						return [PromptsApiTag.PROMPT];
					}

					return [
						{
							id: result.targetId,
							type: ComposedPromptsApiTag.COMPOSED_PROMPT,
						},
						{
							id: "LIST",
							type: ComposedPromptsApiTag.COMPOSED_PROMPT,
						},
					];
				},
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.EVALUATIONS}${EvaluationsApiPath.ROOT}`,
				}),
			}),
		}),
	});

const { useEvaluateMutation } = evaluationApi;

export { useEvaluateMutation };
