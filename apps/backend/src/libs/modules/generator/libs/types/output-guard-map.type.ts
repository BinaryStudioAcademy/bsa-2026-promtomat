import { type SchemaResultMap } from "./schema-result-map.type.js";

type OutputGuardMap = {
	[K in keyof SchemaResultMap]: (value: unknown) => value is SchemaResultMap[K];
};

export { type OutputGuardMap };
