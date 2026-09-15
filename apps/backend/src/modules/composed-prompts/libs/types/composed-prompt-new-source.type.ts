import { type ComposedPromptSourceDto } from "./types.js";

type ComposedPromptNewSource = Pick<
	ComposedPromptSourceDto,
	"promptId" | "rank"
>;

export { type ComposedPromptNewSource };
