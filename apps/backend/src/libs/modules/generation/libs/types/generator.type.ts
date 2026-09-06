import {
	StructuredGenerationOptions,
	TextGenerationOptions,
} from "~/libs/modules/bedrock/bedrock.js";

type GeneratorInterface = {
	generate<T extends object>(options: StructuredGenerationOptions): Promise<T>;
	generateText(options: TextGenerationOptions): Promise<string>;
};

export { type GeneratorInterface };
