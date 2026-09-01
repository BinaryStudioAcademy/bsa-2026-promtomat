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
	onClick?: () => void;
	size?: ValueOf<typeof ControlSize>;
	type: "button" | "submit";
	variant?: ValueOf<typeof ButtonVariant>;
};

const Button: React.FC<Properties> = ({
	className,
	isDisabled = false,
	isLoading = false,
	label,
	onClick,
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
		onClick={onClick}
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
