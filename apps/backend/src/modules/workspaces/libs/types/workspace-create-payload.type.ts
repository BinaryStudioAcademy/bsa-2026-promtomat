import { type WorkspaceCreateRequestDto } from "./types.js";

type WorkspaceCreatePayload = Omit<
	WorkspaceCreateRequestDto,
	"description" | "stackTags" | "visibility"
> &
	Partial<
		Pick<WorkspaceCreateRequestDto, "description" | "stackTags" | "visibility">
	> & {
		userId: number;
	};

export { type WorkspaceCreatePayload };
