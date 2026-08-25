type Properties = {
	isDisabled?: boolean;
	label: string;
	type?: "button" | "submit";
};

const Button: React.FC<Properties> = ({
	isDisabled = false,
	label,
	type = "button",
}: Properties) => (
	<button disabled={isDisabled} type={type}>
		{label}
	</button>
);

export { Button };
