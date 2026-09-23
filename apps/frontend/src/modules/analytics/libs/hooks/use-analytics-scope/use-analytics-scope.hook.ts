import { useState } from "react";
import { type Control, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";

import {
	DEFAULT_ANALYTICS_SCOPE_VALUES,
	GLOBAL_SCOPE_VALUE,
} from "../../constants/constants.js";
import { AnalyticsGrowthBucket } from "../../enums/enums.js";
import {
	type AnalyticsGranularity,
	type AnalyticsQueryDto,
	type AnalyticsScopeFormValues,
} from "../../types/types.js";

type UseAnalyticsScopeReturn = {
	control: Control<AnalyticsScopeFormValues, null>;
	granularity: AnalyticsGranularity;
	handleGranularityChange: (granularity: AnalyticsGranularity) => void;
	queryPayload: AnalyticsQueryDto;
};

const useAnalyticsScope = (): UseAnalyticsScopeReturn => {
	const { control } = useAppForm<AnalyticsScopeFormValues>({
		defaultValues: DEFAULT_ANALYTICS_SCOPE_VALUES,
	});

	const [granularity, setGranularity] = useState<AnalyticsGranularity>(
		AnalyticsGrowthBucket.DAY,
	);

	const workspaceId = useWatch({ control, name: "workspaceId" });

	const queryPayload: AnalyticsQueryDto = {
		granularity,
		workspaceId: workspaceId === GLOBAL_SCOPE_VALUE ? undefined : workspaceId,
	};

	return {
		control,
		granularity,
		handleGranularityChange: setGranularity,
		queryPayload,
	};
};

export { useAnalyticsScope };
