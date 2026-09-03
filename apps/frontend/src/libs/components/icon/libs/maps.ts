import { type FunctionComponent, type SVGProps } from "react";

import AlertCircleIcon from "~/assets/img/alert-circle.svg?react";
import CheckCircleIcon from "~/assets/img/check-circle.svg?react";
import CheckIcon from "~/assets/img/check.svg?react";
import CircleXIcon from "~/assets/img/circle-x.svg?react";
import CloseIcon from "~/assets/img/close.svg?react";
import EyeFilledIcon from "~/assets/img/eye-filled.svg?react";
import EyeIcon from "~/assets/img/eye.svg?react";
import InfoIcon from "~/assets/img/info.svg?react";
import { IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const iconNameToIcon = {
	[IconName.ALERT_CIRCLE]: AlertCircleIcon,
	[IconName.CHECK]: CheckIcon,
	[IconName.CHECK_CIRCLE]: CheckCircleIcon,
	[IconName.CIRCLE_X]: CircleXIcon,
	[IconName.CLOSE]: CloseIcon,
	[IconName.EYE]: EyeIcon,
	[IconName.EYE_FILLED]: EyeFilledIcon,
	[IconName.INFO]: InfoIcon,
} satisfies Record<
	ValueOf<typeof IconName>,
	FunctionComponent<SVGProps<SVGSVGElement>>
>;

export { iconNameToIcon };
