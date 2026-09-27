import { APIPath, HTTPMethod } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { PaginationValue } from "../prompts/libs/enums/enums.js";
import { ComposedPromptsApiTag } from "./libs/enums/enums.js";
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
			getComposedPrompts: builder.infiniteQuery<
				ComposedPromptGetAllResponseDto,
				Omit<ComposedPromptGetQueryDto, "page">,
				number
			>({
				infiniteQueryOptions: {
					getNextPageParam: (lastPage, _allPages, lastPageParameter) => {
						const isLastPage =
							lastPageParameter * PaginationValue.DEFAULT_LIMIT >=
							lastPage.totalCount;

						return isLastPage
							? undefined
							: lastPageParameter + PaginationValue.DEFAULT_OFFSET;
					},
					initialPageParam: PaginationValue.DEFAULT_PAGE,
				},
				providesTags: (result) => {
					if (!result) {
						return getComposedPromptsTags(undefined);
					}

					const allItems = result.pages.flatMap((page) => page.items);

					return getComposedPromptsTags({
						items: allItems,
					});
				},
				query: ({ pageParam, queryArg }) => ({
					method: HTTPMethod.GET,
					params: { ...queryArg, page: pageParam },
					url: APIPath.COMPOSED_PROMPTS,
				}),
			}),
		}),
	});

const {
	useComposeMutation,
	useGetComposedPromptByIdQuery,
	useGetComposedPromptsInfiniteQuery,
} = composedPromptApi;

export {
	useComposeMutation,
	useGetComposedPromptByIdQuery,
	useGetComposedPromptsInfiniteQuery,
};
