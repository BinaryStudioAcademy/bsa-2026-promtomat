import { type FunctionComponent, type SVGProps } from "react";

import AlertCircleIcon from "~/assets/img/alert-circle.svg?react";
import CheckCircleIcon from "~/assets/img/check-circle.svg?react";
import CheckIcon from "~/assets/img/check.svg?react";
import ChevronIcon from "~/assets/img/chevron.svg?react";
import CircleXIcon from "~/assets/img/circle-x.svg?react";
import ClipboardListIcon from "~/assets/img/clipboard-list.svg?react";
import CloseIcon from "~/assets/img/close.svg?react";
import EyeFilledIcon from "~/assets/img/eye-filled.svg?react";
import EyeIcon from "~/assets/img/eye.svg?react";
import FolderIcon from "~/assets/img/folder.svg?react";
import InfoIcon from "~/assets/img/info.svg?react";
import LogOutIcon from "~/assets/img/log-out.svg?react";
import MenuIcon from "~/assets/img/menu.svg?react";
import SearchIcon from "~/assets/img/search.svg?react";
import SparklesIcon from "~/assets/img/sparkles.svg?react";
import UserIcon from "~/assets/img/user.svg?react";
import { IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const iconNameToIcon = {
	[IconName.ALERT_CIRCLE]: AlertCircleIcon,
	[IconName.CHECK]: CheckIcon,
	[IconName.CHECK_CIRCLE]: CheckCircleIcon,
	[IconName.CHEVRON]: ChevronIcon,
	[IconName.CIRCLE_X]: CircleXIcon,
	[IconName.CLIPBOARD_LIST]: ClipboardListIcon,
	[IconName.CLOSE]: CloseIcon,
	[IconName.EYE]: EyeIcon,
	[IconName.EYE_FILLED]: EyeFilledIcon,
	[IconName.FOLDER]: FolderIcon,
	[IconName.INFO]: InfoIcon,
	[IconName.LOG_OUT]: LogOutIcon,
	[IconName.MENU]: MenuIcon,
	[IconName.SEARCH]: SearchIcon,
	[IconName.SPARKLES]: SparklesIcon,
	[IconName.USER]: UserIcon,
} satisfies Record<
	ValueOf<typeof IconName>,
	FunctionComponent<SVGProps<SVGSVGElement>>
>;

export { iconNameToIcon };
