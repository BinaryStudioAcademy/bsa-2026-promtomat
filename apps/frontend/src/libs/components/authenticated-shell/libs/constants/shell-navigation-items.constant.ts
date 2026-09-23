import { AppRoute, IconName } from "~/libs/enums/enums.js";

import { ShellNavigationLabel } from "../enums/enums.js";
import { type ShellNavigationItem } from "../types/types.js";

const SHELL_NAVIGATION_ITEMS: readonly ShellNavigationItem[] = [
	{
		iconName: IconName.SEARCH,
		label: ShellNavigationLabel.SMART_SEARCH,
		to: AppRoute.PROMPTS_HISTORY,
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
];

export { SHELL_NAVIGATION_ITEMS };
