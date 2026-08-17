import { type AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type Config } from "./libs/types/config.type.js";
import { type EnvironmentSchema } from "./libs/types/environment-schema.type.js";

class BaseConfig implements Config {
	public ENV: EnvironmentSchema;

	public constructor() {
		this.ENV = this.envSchema;
	}

	private get envSchema(): EnvironmentSchema {
		return {
			API: {
				ORIGIN_URL: import.meta.env["VITE_APP_API_ORIGIN_URL"] as string,
			},
			APP: {
				ENVIRONMENT: import.meta.env["VITE_APP_NODE_ENV"] as ValueOf<
					typeof AppEnvironment
				>,
			},
		};
	}
}

export { BaseConfig };
