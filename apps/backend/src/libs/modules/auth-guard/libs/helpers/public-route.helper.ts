import { PUBLIC_ROUTES } from "../enums/enums.js";
import { type HttpMethodValue } from "../types/types.js";

const publicPaths = Object.keys(PUBLIC_ROUTES);
const sortedPublicPaths = [...publicPaths].toSorted(
	(a, b) => b.length - a.length,
);

function isPublicRoute(
	lookupPath: string,
	currentMethod: HttpMethodValue,
): boolean {
	const exactMatchRoute = PUBLIC_ROUTES[lookupPath];

	if (exactMatchRoute?.includes(currentMethod)) {
		return true;
	}

	const isPublicPrefix = sortedPublicPaths.some((path) => {
		if (lookupPath.startsWith(path)) {
			const methods = PUBLIC_ROUTES[path];
			return methods?.includes(currentMethod);
		}
		return false;
	});

	return isPublicPrefix;
}

export { isPublicRoute };
