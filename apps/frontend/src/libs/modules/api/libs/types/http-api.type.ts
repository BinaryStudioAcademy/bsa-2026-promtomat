import { type HTTPApiOptions } from "./http-api-options.type.js";

type HTTPApi = {
	load(path: string, options: HTTPApiOptions): Promise<Response>;
};

export { type HTTPApi };
