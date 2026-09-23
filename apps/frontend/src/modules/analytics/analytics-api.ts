import { APIPath } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";

import { AnalyticsApiPath, AnalyticsApiTag } from "./libs/enums/enums.js";
import {
	type AnalyticsDashboardResponseDto,
	type AnalyticsQueryDto,
} from "./libs/types/types.js";

const analyticsApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [AnalyticsApiTag.ANALYTIC],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getAnalytics: builder.query<
				AnalyticsDashboardResponseDto,
				AnalyticsQueryDto
			>({
				providesTags: [AnalyticsApiTag.ANALYTIC],
				query: (queryPayload) => ({
					params: queryPayload,
					url: `${APIPath.ANALYTICS}${AnalyticsApiPath.ROOT}`,
				}),
			}),
		}),
	});

const { useGetAnalyticsQuery } = analyticsApi;

export { useGetAnalyticsQuery };
