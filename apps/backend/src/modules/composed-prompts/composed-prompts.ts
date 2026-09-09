import { ComposedPromptModel } from "./composed-prompt.model.js";
import { ComposedPromptRepository } from "./composed-prompt.repository.js";

const composedPromptRepository = new ComposedPromptRepository(
	ComposedPromptModel,
);

export { composedPromptRepository };
export { ComposedPromptEntity } from "./composed-prompt.entity.js";
export { computeDescriptionHash } from "./libs/helpers/helpers.js";
