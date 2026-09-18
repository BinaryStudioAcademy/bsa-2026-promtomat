import { matchPath } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { type NavigableRoute } from "~/libs/types/types.js";

import { SMART_SEARCH_ACTIVE_PATHS } from "../constants/constants.js";

type Parameters = {
	pathname: string;
	to: NavigableRoute;
};

const checkIsShellRouteActive = ({ pathname, to }: Parameters): boolean => {
	if (to === AppRoute.SMART_SEARCH) {
		return SMART_SEARCH_ACTIVE_PATHS.some(
			(path) => matchPath({ end: true, path }, pathname) !== null,
		);
	}

	return matchPath({ end: false, path: to }, pathname) !== null;
};

export { checkIsShellRouteActive };
