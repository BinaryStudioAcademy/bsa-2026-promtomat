type Properties = {
	className?: string | undefined;
	label: string;
	onClick?: (() => void) | undefined;
	type?: "button" | "submit";
};

const Button: React.FC<Properties> = ({
	className,
	label,
	onClick,
	type = "button",
}: Properties) => (
	<button className={className} onClick={onClick} type={type}>
		{label}
	</button>
);

export { Button };
