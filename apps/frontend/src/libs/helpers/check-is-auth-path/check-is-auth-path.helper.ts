import { AppRoute } from "~/libs/enums/enums.js";

const AUTH_PATHS: ReadonlySet<string> = new Set([
	AppRoute.SIGN_IN,
	AppRoute.SIGN_UP,
]);

const checkIsAuthPath = (path: string): boolean => AUTH_PATHS.has(path);

export { checkIsAuthPath };
