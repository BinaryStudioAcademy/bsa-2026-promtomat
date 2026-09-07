import { type SchemaResultMap } from "./schema-result-map.type.js";
import { type TextGenerationOptions } from "./text-generation-options.type.js";

type StructuredGenerationOptions<K extends keyof SchemaResultMap> =
	TextGenerationOptions & {
		schemaKey: K;
	};

export { type StructuredGenerationOptions };
