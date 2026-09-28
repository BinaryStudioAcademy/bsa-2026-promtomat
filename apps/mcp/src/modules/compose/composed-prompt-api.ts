import { APIPath } from "~/libs/enums/enums.js";
import {
	type HTTP,
	HTTPMethod,
	parseResponseBody,
} from "~/libs/modules/http/http.js";

import {
	type ComposeRequestDto,
	type ComposeResponseDto,
} from "./libs/types/types.js";
import { composeResponseValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

class ComposedPromptApi {
	private http: HTTP;

	public constructor(http: HTTP) {
		this.http = http;
	}

	public async compose({
		description,
		workspaceId,
	}: ComposeRequestDto): Promise<ComposeResponseDto> {
		const response = await this.http.load(APIPath.COMPOSED_PROMPTS, {
			method: HTTPMethod.POST,
			payload: JSON.stringify({
				description,
				workspaceId,
			}),
		});

		return await parseResponseBody(response, composeResponseValidationSchema);
	}
}

export { ComposedPromptApi };
