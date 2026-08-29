import { NavLink } from "react-router-dom";

import { type NavigableRoute } from "~/libs/types/types.js";

type Properties = {
	children: React.ReactNode;
	className?: string | undefined;
	to: NavigableRoute;
};

const Link: React.FC<Properties> = ({
	children,
	className = "",
	to,
}: Properties) => (
	<NavLink className={className} to={to}>
		{children}
	</NavLink>
);

export { Link };
