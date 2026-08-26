type Properties = {
	className?: string;
};
// TODO: will standarize the svg using svgr when icon issue already exist

const NoAccessIllustration: React.FC<Properties> = ({
	className,
}: Properties) => (
	<svg
		aria-hidden="true"
		className={className}
		focusable="false"
		viewBox="0 0 200 180"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle className="illustration-backdrop" cx="100" cy="86" r="62" />

		<circle className="illustration-fleck" cx="36" cy="46" r="3" />
		<circle className="illustration-fleck" cx="168" cy="128" r="2.5" />
		<path className="illustration-fleck-mark" d="M34 118l8 8M42 118l-8 8" />
		<path className="illustration-fleck-mark" d="M160 44l9 9M169 44l-9 9" />

		<path className="illustration-shackle" d="M84 84V66a16 16 0 0 1 32 0v18" />
		<rect
			className="illustration-body"
			height="52"
			rx="9"
			width="64"
			x="68"
			y="82"
		/>
		<circle className="illustration-keyhole" cx="100" cy="102" r="6.5" />
		<path className="illustration-keyhole" d="M97 106h6l1.5 12h-9z" />

		<circle className="illustration-badge-ring" cx="138" cy="130" r="22" />
		<circle className="illustration-badge" cx="138" cy="130" r="18" />
		<path
			className="illustration-badge-mark"
			d="M131 123l14 14M145 123l-14 14"
		/>
	</svg>
);

export { NoAccessIllustration };
