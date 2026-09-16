import { type FieldPath } from "react-hook-form";

import { type ComposeRequestDto } from "~/modules/composed-prompts/composed-prompts.js";

const GENERATE_FIELDS = [
	"description",
	"workspaceId",
] satisfies FieldPath<ComposeRequestDto>[];

export { GENERATE_FIELDS };
