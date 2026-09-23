import React from "react";
import { type Control } from "react-hook-form";

import { Select } from "~/libs/components/select/select.js";
import { ControlSize } from "~/libs/enums/enums.js";
import { GLOBAL_SCOPE_VALUE } from "~/modules/analytics/libs/constants/constants.js";
import { type AnalyticsScopeFormValues } from "~/modules/analytics/libs/types/types.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import { AnalyticLabel } from "../../libs/enums/enums.js";

type Properties = {
	control: Control<AnalyticsScopeFormValues, null>;
};

const ScopeSelect: React.FC<Properties> = ({ control }: Properties) => {
	const { data: { items: workspaces = [] } = {} } = useGetWorkspacesQuery({});

	const options = [
		{ label: AnalyticLabel.GLOBAL_SCOPE_OPTION, value: GLOBAL_SCOPE_VALUE },
		...workspaces.map(({ id, name }) => ({
			label: name,
			value: id,
		})),
	];

	return (
		<Select
			control={control}
			label={AnalyticLabel.SCOPE_FIELD}
			name="workspaceId"
			options={options}
			size={ControlSize.LG}
		/>
	);
};

export { ScopeSelect };
