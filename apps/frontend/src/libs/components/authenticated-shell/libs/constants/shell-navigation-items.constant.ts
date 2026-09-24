import { AppRoute, IconName } from "~/libs/enums/enums.js";

import { ShellNavigationLabel } from "../enums/enums.js";
import { type ShellNavigationItem } from "../types/types.js";

const SHELL_NAVIGATION_ITEMS: readonly ShellNavigationItem[] = [
	{
		iconName: IconName.SEARCH,
		label: ShellNavigationLabel.SMART_SEARCH,
		to: AppRoute.SMART_SEARCH,
	},
	{
		iconName: IconName.FOLDER,
		label: ShellNavigationLabel.WORKSPACES,
		to: AppRoute.WORKSPACES,
	},
	{
		iconName: IconName.CLIPBOARD_LIST,
		label: ShellNavigationLabel.TRAINING,
		to: AppRoute.TRAINING,
	},
	{
		iconName: IconName.STATS_BAR,
		label: ShellNavigationLabel.ANALYTICS,
		to: AppRoute.ANALYTICS,
	},
];

export { SHELL_NAVIGATION_ITEMS };
