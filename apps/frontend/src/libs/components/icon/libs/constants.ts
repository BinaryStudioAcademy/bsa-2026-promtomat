import { type FunctionComponent, type SVGProps } from "react";

import CheckIcon from "~/assets/img/check.svg?react";
import EyeFilledIcon from "~/assets/img/eye-filled.svg?react";
import EyeIcon from "~/assets/img/eye.svg?react";
import { IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const ICON_NAME_TO_ICON = {
	[IconName.CHECK]: CheckIcon,
	[IconName.EYE]: EyeIcon,
	[IconName.EYE_FILLED]: EyeFilledIcon,
} satisfies Record<
	ValueOf<typeof IconName>,
	FunctionComponent<SVGProps<SVGSVGElement>>
>;

export { ICON_NAME_TO_ICON };
