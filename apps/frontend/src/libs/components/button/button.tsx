import {
	LoaderSize,
	LoaderVariant,
} from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";

type Properties = {
	isLoading?: boolean;
	label: string;
	type?: "button" | "submit";
};

const Button: React.FC<Properties> = ({
	isLoading = false,
	label,
	type = "button",
}: Properties) => (
	<button disabled={isLoading} type={type}>
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
