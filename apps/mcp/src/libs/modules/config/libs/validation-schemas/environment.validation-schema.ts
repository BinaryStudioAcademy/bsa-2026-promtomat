import { z } from "zod";

import { MCPEnvironmentVariable } from "~/libs/enums/enums.js";

import { ConfigValidationMessage } from "../enums/enums.js";
import { type EnvironmentSchema } from "../types/types.js";

const HTTP_PROTOCOL_PATTERN = /^https?$/;

const TRAILING_SLASH_PATTERN = /\/$/;

const environmentValidationSchema = z
	.object({
		[MCPEnvironmentVariable.API_TOKEN]: z
			.string({ error: ConfigValidationMessage.API_TOKEN_MISSING })
			.nonempty({ error: ConfigValidationMessage.API_TOKEN_MISSING }),
		[MCPEnvironmentVariable.API_URL]: z
			.string({ error: ConfigValidationMessage.API_URL_MISSING })
			.pipe(
				z.url({
					error: ConfigValidationMessage.API_URL_INVALID,
					protocol: HTTP_PROTOCOL_PATTERN,
				}),
			)
			.transform((url) => url.replace(TRAILING_SLASH_PATTERN, "")),
	})
	.transform((variables): EnvironmentSchema => ({
		API: {
			TOKEN: variables[MCPEnvironmentVariable.API_TOKEN],
			URL: variables[MCPEnvironmentVariable.API_URL],
		},
	}));

export { environmentValidationSchema };
