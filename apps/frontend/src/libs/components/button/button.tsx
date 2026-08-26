type Properties = {
	className?: string;
	label: string;
	onClick?: () => void;
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
