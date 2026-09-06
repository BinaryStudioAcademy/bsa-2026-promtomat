import { type HTTPMethod } from "~/libs/modules/http/http.js";

type HttpMethodValue = (typeof HTTPMethod)[keyof typeof HTTPMethod];

type PublicRoutes = {
	[path: string]: HttpMethodValue[];
};

export { type HttpMethodValue, type PublicRoutes };
