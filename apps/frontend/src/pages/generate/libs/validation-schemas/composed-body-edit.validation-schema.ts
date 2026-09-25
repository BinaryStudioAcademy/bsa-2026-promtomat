import { promptCreateValidationSchema } from "~/modules/prompts/prompts.js";

const composedBodyEdit = promptCreateValidationSchema.pick({
	promptBody: true,
});

export { composedBodyEdit };
