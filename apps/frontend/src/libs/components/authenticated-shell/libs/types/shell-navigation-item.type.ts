import { type IconName } from "~/libs/enums/enums.js";
import { type NavigableRoute, type ValueOf } from "~/libs/types/types.js";

import { type ShellNavigationLabel } from "../enums/enums.js";

type ShellNavigationItem = {
	iconName: ValueOf<typeof IconName>;
	label: ValueOf<typeof ShellNavigationLabel>;
	to: NavigableRoute;
};

export { type ShellNavigationItem };
