import convict from "convict";

import { MCPEnvironmentVariable } from "~/libs/enums/enums.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { ConfigFormat } from "./libs/enums/enums.js";
import { apiUrlFormat } from "./libs/formats/formats.js";
import { validateApiToken } from "./libs/helpers/helpers.js";
import { type Config, type EnvironmentSchema } from "./libs/types/types.js";

class EnvironmentConfig implements Config {
	public ENV: EnvironmentSchema;

	public constructor(logger: Logger) {
		convict.addFormat(apiUrlFormat);

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
		});

		schema.validate({
			allowed: "strict",
			output: (message) => {
				logger.warn(message);
			},
		});

		this.ENV = schema.getProperties();
	}
}

export { EnvironmentConfig };
