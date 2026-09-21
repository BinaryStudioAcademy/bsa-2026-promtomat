import { APIPath } from "~/libs/enums/enums.js";
import {
	type HTTP,
	HTTPMethod,
	parseResponseBody,
} from "~/libs/modules/http/http.js";

import { RepositoryBindingsApiPath } from "./libs/enums/enums.js";
import { type Resolution } from "./libs/types/types.js";
import { resolutionValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

type CreatePayload = {
	remoteUrl: string;
	stackTags: string[];
	workspaceId: number;
};

class RepositoryBindingApi {
	private http: HTTP;

	public constructor(http: HTTP) {
		this.http = http;
	}

	public async create(payload: CreatePayload): Promise<void> {
		await this.http.load(
			`${APIPath.REPOSITORY_BINDINGS}${RepositoryBindingsApiPath.ROOT}`,
			{
				headers: new Headers(),
				method: HTTPMethod.POST,
				payload: JSON.stringify(payload),
			},
		);
	}

	public async resolve(remoteUrl: string): Promise<Resolution> {
		const query = new URLSearchParams({ remoteUrl }).toString();
		const response = await this.http.load(
			`${APIPath.REPOSITORY_BINDINGS}${RepositoryBindingsApiPath.RESOLVE}?${query}`,
			{
				headers: new Headers(),
				method: HTTPMethod.GET,
				payload: null,
			},
		);

		return await parseResponseBody(response, resolutionValidationSchema);
	}
}

export { RepositoryBindingApi };
