import { type FunctionComponent, type SVGProps } from "react";

import AlertCircleIcon from "~/assets/img/alert-circle.svg?react";
import CheckCircleIcon from "~/assets/img/check-circle.svg?react";
import CheckIcon from "~/assets/img/check.svg?react";
import ChevronIcon from "~/assets/img/chevron.svg?react";
import CircleXIcon from "~/assets/img/circle-x.svg?react";
import CloseIcon from "~/assets/img/close.svg?react";
import CodeIcon from "~/assets/img/code.svg?react";
import EditIcon from "~/assets/img/edit.svg?react";
import EyeFilledIcon from "~/assets/img/eye-filled.svg?react";
import EyeIcon from "~/assets/img/eye.svg?react";
import InfoIcon from "~/assets/img/info.svg?react";
import LockIcon from "~/assets/img/lock.svg?react";
import LogOutIcon from "~/assets/img/log-out.svg?react";
import MenuIcon from "~/assets/img/menu.svg?react";
import PlusIcon from "~/assets/img/plus.svg?react";
import SettingsIcon from "~/assets/img/settings.svg?react";
import Trash2Icon from "~/assets/img/trash-2.svg?react";
import UserCogIcon from "~/assets/img/user-cog.svg?react";
import UsersIcon from "~/assets/img/users.svg?react";
import { IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const iconNameToIcon = {
	[IconName.ALERT_CIRCLE]: AlertCircleIcon,
	[IconName.CHECK]: CheckIcon,
	[IconName.CHECK_CIRCLE]: CheckCircleIcon,
	[IconName.CHEVRON]: ChevronIcon,
	[IconName.CIRCLE_X]: CircleXIcon,
	[IconName.CLOSE]: CloseIcon,
	[IconName.CODE]: CodeIcon,
	[IconName.EDIT]: EditIcon,
	[IconName.EYE]: EyeIcon,
	[IconName.EYE_FILLED]: EyeFilledIcon,
	[IconName.INFO]: InfoIcon,
	[IconName.LOCK]: LockIcon,
	[IconName.LOG_OUT]: LogOutIcon,
	[IconName.MENU]: MenuIcon,
	[IconName.PLUS]: PlusIcon,
	[IconName.SETTINGS]: SettingsIcon,
	[IconName.TRASH_2]: Trash2Icon,
	[IconName.USER_COG]: UserCogIcon,
	[IconName.USERS]: UsersIcon,
} satisfies Record<
	ValueOf<typeof IconName>,
	FunctionComponent<SVGProps<SVGSVGElement>>
>;

export { iconNameToIcon };
