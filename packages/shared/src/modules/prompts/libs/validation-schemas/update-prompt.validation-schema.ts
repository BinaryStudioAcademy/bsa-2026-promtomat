import { promptCreateValidationSchema } from "./validation-schemas.js";

const promptUpdate = promptCreateValidationSchema.pick({
	taskIntent: true,
});

export { promptUpdate };
