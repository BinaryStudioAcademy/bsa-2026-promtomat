import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { PromptsApiTag } from "~/modules/prompts/libs/enums/enums.js";

import { EvaluationsApiPath } from "./libs/enums/enums.js";
import {
	type EvaluationCreateRequestDto,
	type EvaluationResponseDto,
} from "./libs/types/types.js";

const evaluationApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [PromptsApiTag.PROMPT],
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

					return [];
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
