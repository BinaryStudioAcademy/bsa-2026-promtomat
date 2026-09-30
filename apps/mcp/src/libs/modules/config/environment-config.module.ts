import convict from "convict";

import { MCPEnvironmentVariable } from "~/libs/enums/enums.js";

import { ConfigFormat } from "./libs/enums/enums.js";
import { apiUrlFormat, webUrlFormat } from "./libs/formats/formats.js";
import { resolveWebUrl, validateApiToken } from "./libs/helpers/helpers.js";
import { type Config, type EnvironmentSchema } from "./libs/types/types.js";

class EnvironmentConfig implements Config {
	public ENV: EnvironmentSchema;

	public constructor() {
		convict.addFormat(apiUrlFormat);
		convict.addFormat(webUrlFormat);

		const schema = convict<EnvironmentSchema>({
			API: {
				TOKEN: {
					default: null,
					doc: "API token the server acts as",
					env: MCPEnvironmentVariable.API_TOKEN,
					format: validateApiToken,
					sensitive: true,
				},
				URL: {
					default: null,
					doc: "API base URL including the version prefix",
					env: MCPEnvironmentVariable.API_URL,
					format: ConfigFormat.API_URL,
				},
			},
			WEB: {
				URL: {
					default: "",
					doc: "Web application base URL used in links, the origin of the API URL when not set",
					env: MCPEnvironmentVariable.WEB_URL,
					format: ConfigFormat.WEB_URL,
				},
			},
		});

		schema.validate({ allowed: "strict" });

		const environment = schema.getProperties();

		this.ENV = {
			...environment,
			WEB: {
				URL: resolveWebUrl(environment.WEB.URL, environment.API.URL),
			},
		};
	}
}

export { EnvironmentConfig };
