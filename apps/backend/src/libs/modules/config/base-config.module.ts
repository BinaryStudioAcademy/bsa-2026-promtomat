import convict, { type Config as LibraryConfig } from "convict";
import { config } from "dotenv";

import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { type Config, type EnvironmentSchema } from "./libs/types/types.js";

const validateJwtExpiresIn = (value: unknown): void => {
	if (typeof value !== "string" || !/^\d+[smhdwy]?$/.test(value)) {
		throw new Error(
			"JWT_EXPIRES_IN must be a valid duration string (e.g., '24h').",
		);
	}
};

const validateJwtSecret = (value: unknown): void => {
	if (typeof value !== "string" || value.trim() === "") {
		throw new Error("JWT_SECRET must be a non-empty string.");
	}
};

class BaseConfig implements Config {
	private logger: Logger;

	public ENV: EnvironmentSchema;

	public constructor(logger: Logger) {
		this.logger = logger;

		config();

		if (!process.env["NODE_ENV"]) {
			config({ path: "apps/backend/.env" });
		}

		this.envSchema.load({});
		this.envSchema.validate({
			allowed: "strict",
			output: (message) => {
				this.logger.info(message);
			},
		});

		this.ENV = this.envSchema.getProperties();
		this.logger.info(".env file found and successfully parsed!");
	}

	private get envSchema(): LibraryConfig<EnvironmentSchema> {
		return convict<EnvironmentSchema>({
			APP: {
				ENVIRONMENT: {
					default: null,
					doc: "Application environment",
					env: "NODE_ENV",
					format: Object.values(AppEnvironment),
				},
				HOST: {
					default: null,
					doc: "Host for server app",
					env: "HOST",
					format: String,
				},
				PORT: {
					default: null,
					doc: "Port for incoming connections",
					env: "PORT",
					format: Number,
				},
			},
			DB: {
				DIALECT: {
					default: null,
					doc: "Database dialect",
					env: "DB_DIALECT",
					format: String,
				},
				HOST: {
					default: null,
					doc: "Database host",
					env: "DB_HOST",
					format: String,
				},
				NAME: {
					default: null,
					doc: "Database name",
					env: "DB_NAME",
					format: String,
				},
				PASSWORD: {
					default: null,
					doc: "Database password",
					env: "DB_PASSWORD",
					format: String,
				},
				POOL_MAX: {
					default: null,
					doc: "Database pool max count",
					env: "DB_POOL_MAX",
					format: Number,
				},
				POOL_MIN: {
					default: null,
					doc: "Database pool min count",
					env: "DB_POOL_MIN",
					format: Number,
				},
				PORT: {
					default: null,
					doc: "Database port",
					env: "DB_PORT",
					format: Number,
				},
				USERNAME: {
					default: null,
					doc: "Database username",
					env: "DB_USERNAME",
					format: String,
				},
			},
			JWT: {
				EXPIRES_IN: {
					default: null,
					doc: "JWT expiration time",
					env: "JWT_EXPIRES_IN",
					format: validateJwtExpiresIn,
				},
				SECRET: {
					default: null,
					doc: "Secret for JWT signing",
					env: "JWT_SECRET",
					format: validateJwtSecret,
				},
			},
		});
	}
}

export { BaseConfig };
