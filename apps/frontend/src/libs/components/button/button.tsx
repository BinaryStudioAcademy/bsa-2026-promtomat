import {
	LoaderSize,
	LoaderVariant,
} from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
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
