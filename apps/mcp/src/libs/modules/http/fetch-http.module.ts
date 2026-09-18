import {
	ResponseError,
	UnreachableError,
} from "~/libs/exceptions/exceptions.js";

import { AUTHORIZATION_SCHEME } from "./libs/constants/constants.js";
import { ContentType, HTTPHeader } from "./libs/enums/enums.js";
import {
	getUnreachableReason,
	parseResponseBody,
} from "./libs/helpers/helpers.js";
import { type HTTP, type HTTPOptions } from "./libs/types/types.js";
import { errorResponseValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

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

	private async request(path: string, options: HTTPOptions): Promise<Response> {
		const { method, payload } = options;
		const headers = new Headers(options.headers);
		headers.set(
			HTTPHeader.AUTHORIZATION,
			`${AUTHORIZATION_SCHEME} ${this.token}`,
		);
		headers.set(HTTPHeader.CONTENT_TYPE, ContentType.JSON);

		const request = new Request(`${this.baseUrl}${path}`, {
			body: payload,
			headers,
			method,
			signal: AbortSignal.timeout(this.timeoutMs),
		});

		try {
			return await fetch(request);
		} catch (error) {
			throw new UnreachableError({
				cause: error,
				message: getUnreachableReason(error),
			});
		}
	}

	public async load(path: string, options: HTTPOptions): Promise<Response> {
		const response = await this.request(path, options);

		if (!response.ok) {
			const { code, message } = await parseResponseBody(
				response,
				errorResponseValidationSchema,
			);

			throw new ResponseError({ code, message, status: response.status });
		}

		return response;
	}
}

export { FetchHTTP };
