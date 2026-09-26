import { promptCreate } from "./create-prompt.validation-schema.js";

const promptUpdateBody = promptCreate.pick({
	promptBody: true,
});

export { promptUpdateBody };
