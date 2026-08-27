import { type ButtonVariant, type ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./button.module.css";

type Properties = {
	/**
	 * Layout from the parent is allowed (spacing/placement). Appearance is not:
	 * pick a `variant` and `size` instead of passing colour or state classes.
	 */
	className?: string;
	isDisabled?: boolean;
	label: string;
	onClick?: () => void;
	size?: ValueOf<typeof ControlSize>;
	type?: "button" | "submit";
	variant?: ValueOf<typeof ButtonVariant>;
};

const Button: React.FC<Properties> = ({
	className,
	isDisabled = false,
	label,
	onClick,
	size = "md",
	type = "button",
	variant = "primary",
}: Properties) => (
	<button
		className={getValidClasses(
			styles["button"],
			styles[variant],
			styles[size],
			className,
		)}
		disabled={isDisabled}
		onClick={onClick}
		type={type}
	>
		{label}
	</button>
);

export { Button };
