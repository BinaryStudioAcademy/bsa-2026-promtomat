import { type FunctionComponent, type SVGProps } from "react";

import CheckIcon from "~/assets/img/check.svg?react";
import EyeFilledIcon from "~/assets/img/eye-filled.svg?react";
import EyeIcon from "~/assets/img/eye.svg?react";
import MenuIcon from "~/assets/img/menu.svg?react";
import { IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const iconNameToIcon = {
	[IconName.CHECK]: CheckIcon,
	[IconName.EYE]: EyeIcon,
	[IconName.EYE_FILLED]: EyeFilledIcon,
	[IconName.MENU]: MenuIcon,
} satisfies Record<
	ValueOf<typeof IconName>,
	FunctionComponent<SVGProps<SVGSVGElement>>
>;

export { iconNameToIcon };
