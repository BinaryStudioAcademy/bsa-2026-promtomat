import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { AnalyticsApiTag } from "~/modules/analytics/libs/enums/enums.js";
import { PromptsApiTag } from "~/modules/prompts/libs/enums/enums.js";
import { WorkspacesApiTag } from "~/modules/workspaces/workspaces.js";

import { ComposedPromptsApiPath } from "./libs/enums/enums.js";
import {
	type ComposedPromptAdoptRequestDto,
	type ComposeRequestDto,
	type ComposeResponseDto,
	type PromptDto,
} from "./libs/types/types.js";

const composedPromptApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [
			AnalyticsApiTag.ANALYTIC,
			PromptsApiTag.PROMPT,
			WorkspacesApiTag.WORKSPACE,
		],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			adopt: builder.mutation<
				PromptDto,
				{ id: number; payload: ComposedPromptAdoptRequestDto }
			>({
				invalidatesTags: [
					AnalyticsApiTag.ANALYTIC,
					PromptsApiTag.PROMPT,
					WorkspacesApiTag.WORKSPACE,
				],
				query: ({ id, payload }) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: configureString(
						APIPath.COMPOSED_PROMPTS,
						ComposedPromptsApiPath.$ID_ADOPT,
						{ id: String(id) },
					),
				}),
			}),
			compose: builder.mutation<ComposeResponseDto, ComposeRequestDto>({
				query: (payload) => ({
					body: payload,
					method: HTTPMethod.POST,
					url: `${APIPath.COMPOSED_PROMPTS}${ComposedPromptsApiPath.ROOT}`,
				}),
			}),
		}),
	});

const { useAdoptMutation, useComposeMutation } = composedPromptApi;

export { useAdoptMutation, useComposeMutation };
