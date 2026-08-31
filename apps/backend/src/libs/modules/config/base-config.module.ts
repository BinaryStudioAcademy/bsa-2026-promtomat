import convict, { type Config as LibraryConfig } from "convict";
import { config } from "dotenv";

import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { JwtAlgorithm } from "./libs/enums/enums.js";
import {
	validateJwtExpiresIn,
	validateJwtSecret,
} from "./libs/helpers/helpers.js";
import { type Config, type EnvironmentSchema } from "./libs/types/types.js";

class BaseConfig implements Config {
	private logger: Logger;

	public ENV: EnvironmentSchema;

	public constructor(logger: Logger) {
		this.logger = logger;

		config();

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
			EMBEDDING: {
				DIMENSIONS: {
					default: null,
					doc: "Expected embedding vector dimension",
					env: "EMBEDDING_DIMENSIONS",
					format: Number,
				},
				LOCAL_PATH: {
					default: null,
					doc: "Local directory the embedding model is provisioned into",
					env: "EMBEDDING_LOCAL_PATH",
					format: String,
				},
				MODEL_ID: {
					default: null,
					doc: "HuggingFace id of the embedding model",
					env: "EMBEDDING_MODEL_ID",
					format: String,
				},
				S3_BUCKET: {
					default: null,
					doc: "S3 bucket of the embedding model store",
					env: "EMBEDDING_S3_BUCKET",
					format: String,
				},
				S3_PREFIX: {
					default: null,
					doc: "Key prefix of the embedding model inside the store bucket",
					env: "EMBEDDING_S3_PREFIX",
					format: String,
				},
			},
			HASHING: {
				SALT_LENGTH: {
					default: null,
					doc: "Salt length in bytes for hashing",
					env: "SALT_LENGTH",
					format: Number,
				},
			},
			JWT: {
				ALG: {
					default: null,
					doc: "Algorithm for JWT signing",
					env: "JWT_ALG",
					format: Object.values(JwtAlgorithm),
				},
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
