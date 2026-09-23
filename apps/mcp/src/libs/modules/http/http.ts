import { config } from "~/libs/modules/config/config.js";

import { FetchHTTP } from "./fetch-http.module.js";
import { DEFAULT_REQUEST_TIMEOUT_MS } from "./libs/constants/constants.js";

const http = new FetchHTTP({
	baseUrl: config.ENV.API.URL,
	timeoutMs: DEFAULT_REQUEST_TIMEOUT_MS,
	token: config.ENV.API.TOKEN,
});

export { http };
export { HTTPMethod } from "./libs/enums/enums.js";
export { parseResponseBody } from "./libs/helpers/helpers.js";
export { type HTTP } from "./libs/types/types.js";
