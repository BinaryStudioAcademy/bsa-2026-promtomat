import { APIPath } from "~/libs/enums/enums.js";
import { type HTTP, HTTPMethod } from "~/libs/modules/http/http.js";
import { type UserDto } from "~/libs/types/types.js";

import { AuthApiPath } from "./libs/enums/enums.js";

class AuthApi {
	private http: HTTP;

	public constructor(http: HTTP) {
		this.http = http;
	}

	public async getAuthenticatedUser(): Promise<UserDto> {
		const path = `${APIPath.AUTH}${AuthApiPath.AUTHENTICATED_USER}`;

		const response = await this.http.load(path, {
			headers: new Headers(),
			method: HTTPMethod.GET,
			payload: null,
		});

		if (!response.ok) {
			throw new Error(
				`Promptomat API answered ${String(response.status)} for ${path}`,
			);
		}

		return (await response.json()) as UserDto;
	}
}

export { AuthApi };
