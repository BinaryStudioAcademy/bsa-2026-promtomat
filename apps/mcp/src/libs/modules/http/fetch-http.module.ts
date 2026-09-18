import { AUTHORIZATION_SCHEME } from "./libs/constants/constants.js";
import { ContentType, HTTPHeader } from "./libs/enums/enums.js";
import { type HTTP, type HTTPOptions } from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	timeoutMs: number;
	token: string;
};

class FetchHTTP implements HTTP {
	private baseUrl: string;

	private timeoutMs: number;

	private token: string;

	public constructor({ baseUrl, timeoutMs, token }: Constructor) {
		this.baseUrl = baseUrl;
		this.timeoutMs = timeoutMs;
		this.token = token;
	}

	public async load(path: string, options: HTTPOptions): Promise<Response> {
		const headers = new Headers(options.headers);
		headers.set(
			HTTPHeader.AUTHORIZATION,
			`${AUTHORIZATION_SCHEME} ${this.token}`,
		);
		headers.set(HTTPHeader.CONTENT_TYPE, ContentType.JSON);

		return await fetch(`${this.baseUrl}${path}`, {
			body: options.payload,
			headers,
			method: options.method,
			signal: AbortSignal.timeout(this.timeoutMs),
		});
	}
}

export { FetchHTTP };
