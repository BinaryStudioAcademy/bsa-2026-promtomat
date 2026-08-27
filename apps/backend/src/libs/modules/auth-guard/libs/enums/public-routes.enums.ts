import { APIPath, AuthApiPath } from "@promptomat/shared";

const API_VERSION_PREFIX = "/api/v1";
const SWAGGER_DOCS_PREFIX = "/v1/documentation";

const PUBLIC_ROUTES: readonly string[] = [
	`${API_VERSION_PREFIX}${APIPath.AUTH}${AuthApiPath.SIGN_IN}`,
	`${API_VERSION_PREFIX}${APIPath.AUTH}${AuthApiPath.SIGN_UP}`,
	`${API_VERSION_PREFIX}${APIPath.HEALTH}`,
	SWAGGER_DOCS_PREFIX,
];

export { PUBLIC_ROUTES };
