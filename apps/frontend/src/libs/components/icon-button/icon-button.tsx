import { type Ref } from "react";

import { Icon } from "~/libs/components/icon/icon.js";
import { ControlSize, type IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	ariaControls?: string;
	ariaExpanded?: boolean;
	ariaLabel: string;
	className?: string;
	iconName: ValueOf<typeof IconName>;
	isDisabled?: boolean;
	onClick?: () => void;
	reference?: Ref<HTMLButtonElement>;
	size?: ValueOf<typeof ControlSize>;
	type: "button" | "submit";
};

const IconButton: React.FC<Properties> = ({
	ariaControls,
	ariaExpanded,
	ariaLabel,
	className,
	iconName,
	isDisabled = false,
	onClick,
	reference,
	size = ControlSize.MD,
	type,
}: Properties) => (
	<button
		aria-controls={ariaControls}
		aria-expanded={ariaExpanded}
		aria-label={ariaLabel}
		className={getValidClasses(styles["iconButton"], styles[size], className)}
		disabled={isDisabled}
		onClick={onClick}
		ref={reference}
		type={type}
	>
		<Icon iconName={iconName} />
	</button>
);

export { IconButton };
