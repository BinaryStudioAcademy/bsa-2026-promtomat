import { type AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type JwtAlgorithm } from "../enums/enums.js";

type EnvironmentSchema = {
	APP: {
		ENVIRONMENT: ValueOf<typeof AppEnvironment>;
		HOST: string;
		PORT: number;
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
	HASHING: {
		SALT_LENGTH: number;
	};
	JWT: {
		ALG: ValueOf<typeof JwtAlgorithm>;
		EXPIRES_IN: string;
		SECRET: string;
	};
};

export { type EnvironmentSchema };
