import { promptCreateValidationSchema } from "./validation-schemas.js";

const promptUpdateIntent = promptCreateValidationSchema.pick({
	taskIntent: true,
});

export { promptUpdateIntent };
