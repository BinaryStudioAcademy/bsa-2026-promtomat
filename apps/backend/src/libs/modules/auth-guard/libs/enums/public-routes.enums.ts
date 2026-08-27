import { type PublicRoutes } from "../types/types.js";
import { APIPath, AuthApiPath, HTTPMethod } from "./enums.js";

const API_VERSION_PREFIX = "/api/v1";
const SWAGGER_DOCS_PREFIX = "/v1/documentation";

const PUBLIC_ROUTES: PublicRoutes = {
	[`${API_VERSION_PREFIX}${APIPath.AUTH}${AuthApiPath.SIGN_IN}`]: [
		HTTPMethod.POST,
	],
	[`${API_VERSION_PREFIX}${APIPath.AUTH}${AuthApiPath.SIGN_UP}`]: [
		HTTPMethod.POST,
	],
	[`${API_VERSION_PREFIX}${APIPath.HEALTH}`]: [HTTPMethod.GET],
	[SWAGGER_DOCS_PREFIX]: [HTTPMethod.GET, HTTPMethod.POST],
};

export { PUBLIC_ROUTES };
