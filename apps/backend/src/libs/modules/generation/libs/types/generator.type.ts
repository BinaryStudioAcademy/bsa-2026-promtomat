import { type StructuredGenerationOptions } from "./structured-generation-request.type.js";
import { type TextGenerationOptions } from "./text-generation-options.type.js";

type GeneratorInterface = {
	generate<T extends object>(request: TextGenerationOptions): Promise<T>;
	generateText(request: StructuredGenerationOptions): Promise<string>;
};

export { type GeneratorInterface };
