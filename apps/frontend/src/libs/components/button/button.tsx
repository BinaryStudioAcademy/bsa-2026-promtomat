type Properties = {
	disabled?: boolean;
	label: string;
	type?: "button" | "submit";
};

const Button: React.FC<Properties> = ({
	disabled = false,
	label,
	type = "button",
}: Properties) => (
	<button disabled={disabled} type={type}>
		{label}
	</button>
);

export { Button };
