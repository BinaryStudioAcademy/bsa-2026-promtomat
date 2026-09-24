import { APIPath } from "~/libs/enums/enums.js";
import {
	type HTTP,
	HTTPMethod,
	parseResponseBody,
} from "~/libs/modules/http/http.js";

import { AuthApiPath } from "./libs/enums/enums.js";
import { type AuthenticatedUser } from "./libs/types/types.js";
import { authenticatedUserValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

class AuthApi {
	private http: HTTP;

	public constructor(http: HTTP) {
		this.http = http;
	}

	public async getAuthenticatedUser(): Promise<AuthenticatedUser> {
		const response = await this.http.load(
			`${APIPath.AUTH}${AuthApiPath.AUTHENTICATED_USER}`,
			{
				headers: new Headers(),
				method: HTTPMethod.GET,
				payload: null,
			},
		);

		return await parseResponseBody(response, authenticatedUserValidationSchema);
	}
}

export { AuthApi };
