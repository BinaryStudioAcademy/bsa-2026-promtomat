import { z } from "zod";

import { MCPEnvironmentVariable } from "~/libs/enums/enums.js";

import {
	HEADER_SAFE_TOKEN_PATTERN,
	HTTP_PROTOCOL_PATTERN,
	TRAILING_SLASH_PATTERN,
} from "../constants/constants.js";
import { ConfigValidationMessage } from "../enums/enums.js";
import { type EnvironmentSchema } from "../types/types.js";

const environmentValidationSchema = z
	.object({
		[MCPEnvironmentVariable.API_TOKEN]: z
			.string({ error: ConfigValidationMessage.API_TOKEN_MISSING })
			.nonempty({ error: ConfigValidationMessage.API_TOKEN_MISSING })
			.regex(HEADER_SAFE_TOKEN_PATTERN, {
				error: ConfigValidationMessage.API_TOKEN_INVALID,
			}),
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
