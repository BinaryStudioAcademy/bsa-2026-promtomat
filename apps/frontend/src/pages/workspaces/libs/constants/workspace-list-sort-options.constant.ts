import { WorkspaceListSort } from "~/modules/workspaces/workspaces.js";

const WORKSPACE_LIST_SORT_OPTIONS = [
	{
		label: "Creation date",
		value: WorkspaceListSort.CREATION_DATE,
	},
	{
		label: "Top activity",
		value: WorkspaceListSort.TOP_ACTIVITY,
	},
	{
		label: "Dataset readiness",
		value: WorkspaceListSort.READINESS,
	},
	{
		label: "Average score",
		value: WorkspaceListSort.AVERAGE_SCORE,
	},
] as const;

export { WORKSPACE_LIST_SORT_OPTIONS };
