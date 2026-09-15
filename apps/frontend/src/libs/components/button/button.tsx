import { Icon } from "~/libs/components/icon/icon.js";
import {
	LoaderSize,
	LoaderVariant,
} from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import {
	ButtonVariant,
	ControlSize,
	type IconName,
} from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
	iconName?: ValueOf<typeof IconName>;
	isDisabled?: boolean;
	isLoading?: boolean;
	label: string;
	onBlur?: () => void;
	onClick?: () => void;
	onFocus?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	size?: ValueOf<typeof ControlSize>;
	type: "button" | "submit";
	variant?: ValueOf<typeof ButtonVariant>;
};

const Button: React.FC<Properties> = ({
	className,
	iconName,
	isDisabled = false,
	isLoading = false,
	label,
	onBlur,
	onClick,
	onFocus,
	onMouseEnter,
	onMouseLeave,
	size = ControlSize.MD,
	type,
	variant = ButtonVariant.PRIMARY,
}: Properties) => (
	<button
		className={getValidClasses(
			styles["button"],
			styles[variant],
			styles[size],
			className,
		)}
		disabled={isDisabled || isLoading}
		onBlur={onBlur}
		onClick={onClick}
		onFocus={onFocus}
		onMouseEnter={onMouseEnter}
		onMouseLeave={onMouseLeave}
		type={type}
	>
		{iconName && <Icon iconName={iconName} />}
		{label}
		{isLoading && (
			<Loader
				label="Loading"
				size={LoaderSize.SMALL}
				variant={LoaderVariant.INLINE}
			/>
		)}
	</button>
);

export { Button };
