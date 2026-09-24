import { APIPath } from "~/libs/enums/enums.js";
import {
	type HTTP,
	HTTPMethod,
	parseResponseBody,
} from "~/libs/modules/http/http.js";

import { RepositoryBindingsApiPath } from "./libs/enums/enums.js";
import {
	type CreateRepositoryBindingRequestDto,
	type RepositoryBindingResolution,
} from "./libs/types/types.js";
import { resolution } from "./libs/validation-schemas/validation-schemas.js";

class RepositoryBindingApi {
	private http: HTTP;

	public constructor(http: HTTP) {
		this.http = http;
	}

	public async create(
		payload: CreateRepositoryBindingRequestDto,
	): Promise<void> {
		await this.http.load(APIPath.REPOSITORY_BINDINGS, {
			headers: new Headers(),
			method: HTTPMethod.POST,
			payload: JSON.stringify(payload),
		});
	}

	public async resolve(remoteUrl: string): Promise<RepositoryBindingResolution> {
		const query = new URLSearchParams({ remoteUrl }).toString();
		const response = await this.http.load(
			`${APIPath.REPOSITORY_BINDINGS}${RepositoryBindingsApiPath.RESOLVE}?${query}`,
			{
				headers: new Headers(),
				method: HTTPMethod.GET,
				payload: null,
			},
		);

		return await parseResponseBody(response, resolution);
	}
}

export { RepositoryBindingApi };
