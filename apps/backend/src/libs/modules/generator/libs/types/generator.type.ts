import { type SchemaResultMap } from "./schema-result-map.type.js";
import { type StructuredGenerationOptions } from "./structured-generation-options.type.js";
import { type TextGenerationOptions } from "./text-generation-options.type.js";

type GeneratorInterface = {
	generate<K extends keyof SchemaResultMap>(
		options: StructuredGenerationOptions<K>,
	): Promise<SchemaResultMap[K]>;
	generateText(options: TextGenerationOptions): Promise<string>;
};

export { type GeneratorInterface };
