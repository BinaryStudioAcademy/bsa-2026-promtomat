import { type AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type JwtAlgorithm } from "../enums/enums.js";

type EnvironmentSchema = {
	APP: {
		ENVIRONMENT: ValueOf<typeof AppEnvironment>;
		HOST: string;
		PORT: number;
	};
	AWS: {
		REGION: string;
	};
	BEDROCK: {
		CONNECTION_TIMEOUT_MS: number;
		MAX_ATTEMPTS: number;
		MODEL: {
			ID: string;
		};
		REQUEST_TIMEOUT_MS: number;
	};
	DB: {
		DIALECT: string;
		HOST: string;
		NAME: string;
		PASSWORD: string;
		POOL_MAX: number;
		POOL_MIN: number;
		PORT: number;
		USERNAME: string;
	};
	EMBEDDING: {
		DIMENSIONS: number;
		LOCAL_PATH: string;
		MODEL_ID: string;
		S3_BUCKET: string;
		S3_PREFIX: string;
	};
	GENERATION: {
		CANDIDATE_LIMIT: number;
		MAX_TOKENS: number;
		SOURCE_BODY_MAX_LENGTH: number;
	};
	HASHING: {
		SALT_LENGTH: number;
	};
	JWT: {
		ALG: ValueOf<typeof JwtAlgorithm>;
		EXPIRES_IN: string;
		SECRET: string;
	};
	MAIL: {
		FROM: string;
		HOST: string;
		PASSWORD: string;
		PORT: number;
		USER: string;
	};
	PASSWORD_RESET: {
		LINK_BASE_URL: string;
		REQUEST_LIMIT: number;
		TOKEN_TTL_MINUTES: number;
		WINDOW_MINUTES: number;
	};
};

export { type EnvironmentSchema };
