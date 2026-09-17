import convict, { type Config as LibraryConfig } from "convict";
import { config } from "dotenv";

import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { ConfigFormat, JwtAlgorithm } from "./libs/enums/enums.js";
import { positiveIntegerFormat } from "./libs/formats/formats.js";
import {
	validateEmbeddingLocalPath,
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
		convict.addFormat(positiveIntegerFormat);

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
			AWS: {
				REGION: {
					default: null,
					doc: "Region for AWS resources",
					env: "AWS_REGION",
					format: String,
				},
			},
			BEDROCK: {
				CONNECTION_TIMEOUT_MS: {
					default: null,
					doc: "Milliseconds allowed to establish a connection to Bedrock",
					env: "BEDROCK_CONNECTION_TIMEOUT_MS",
					format: Number,
				},
				MAX_ATTEMPTS: {
					default: null,
					doc: "Total Bedrock attempts, including the first; attempts multiply the wait a caller sees",
					env: "BEDROCK_MAX_ATTEMPTS",
					format: Number,
				},
				MODEL: {
					ID: {
						default: null,
						doc: "Id of the model",
						env: "BEDROCK_MODEL_ID",
						format: String,
					},
				},
				REQUEST_TIMEOUT_MS: {
					default: null,
					doc: "Milliseconds a single Bedrock request may take before it fails",
					env: "BEDROCK_REQUEST_TIMEOUT_MS",
					format: ConfigFormat.POSITIVE_INTEGER,
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
					format: validateEmbeddingLocalPath,
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
			GENERATION: {
				CANDIDATE_LIMIT: {
					default: null,
					doc: "Maximum number of prompt candidates sent to the model as material",
					env: "GENERATION_CANDIDATE_LIMIT",
					format: ConfigFormat.POSITIVE_INTEGER,
				},
				MAX_TOKENS: {
					default: null,
					doc: "Token budget of one composed prompt generation",
					env: "GENERATION_MAX_TOKENS",
					format: ConfigFormat.POSITIVE_INTEGER,
				},
				SOURCE_BODY_MAX_LENGTH: {
					default: null,
					doc: "Characters of one source prompt body sent to the model; longer bodies are truncated",
					env: "GENERATION_SOURCE_BODY_MAX_LENGTH",
					format: ConfigFormat.POSITIVE_INTEGER,
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
			MAIL: {
				FROM: {
					default: null,
					doc: "Mail Address sender",
					env: "MAIL_FROM",
					format: String,
				},
				HOST: {
					default: null,
					doc: "Mail Host Address",
					env: "MAIL_HOST",
					format: String,
				},
				PASSWORD: {
					default: null,
					doc: "Mail Server Password",
					env: "MAIL_PASSWORD",
					format: String,
				},
				PORT: {
					default: null,
					doc: "Mail Server Port",
					env: "MAIL_PORT",
					format: Number,
				},
				USER: {
					default: null,
					doc: "Mail User Identity",
					env: "MAIL_USER",
					format: String,
				},
			},
			PASSWORD_RESET: {
				LINK_BASE_URL: {
					default: null,
					doc: "Password reset link base URL",
					env: "PASSWORD_RESET_LINK_BASE_URL",
					format: String,
				},
				REQUEST_LIMIT: {
					default: null,
					doc: "Password reset requests allowed per address per window",
					env: "PASSWORD_RESET_REQUEST_LIMIT",
					format: Number,
				},
				TOKEN_TTL_MINUTES: {
					default: null,
					doc: "Password reset token time to live in minutes",
					env: "PASSWORD_RESET_TOKEN_TTL_MINUTES",
					format: Number,
				},
				WINDOW_MINUTES: {
					default: null,
					doc: "Length in minutes of the password reset throttle window",
					env: "PASSWORD_RESET_WINDOW_MINUTES",
					format: Number,
				},
			},
		});
	}
}

export { BaseConfig };
