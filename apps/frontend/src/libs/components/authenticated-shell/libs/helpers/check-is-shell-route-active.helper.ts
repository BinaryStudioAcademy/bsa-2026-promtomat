import { matchPath } from "react-router-dom";

import { type NavigableRoute } from "~/libs/types/types.js";

type Parameters = {
	pathname: string;
	to: NavigableRoute;
};

const checkIsShellRouteActive = ({ pathname, to }: Parameters): boolean => {
	return matchPath({ end: false, path: to }, pathname) !== null;
};

export { checkIsShellRouteActive };
