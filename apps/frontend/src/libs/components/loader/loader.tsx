import { type ValueOf } from "~/libs/types/types.js";

import { LoaderColor, LoaderSize, LoaderVariant } from "./libs/enums/enums.js";
import "./loader.css";

type Properties = {
	color?: ValueOf<typeof LoaderColor>;
	label?: string;
	size?: ValueOf<typeof LoaderSize>;
	variant?: ValueOf<typeof LoaderVariant>;
};

const Loader: React.FC<Properties> = ({
	color = LoaderColor.PRIMARY,
	label = "Loading",
	size = LoaderSize.MEDIUM,
	variant = LoaderVariant.SECTION,
}: Properties) => (
	<div
		aria-live="polite"
		className={`Loader Loader-${variant} Loader-${size} Loader-${color}`}
		role="status"
	>
		<span className="Loader-spinner" />
		<span className="visually-hidden">{label}</span>
	</div>
);

export { Loader };
