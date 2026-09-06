import { type WorkspaceCreateRequestDto } from "./types.js";

type WorkspaceCreatePayload = Omit<
	WorkspaceCreateRequestDto,
	"stackTags" | "visibility"
> &
	Partial<Pick<WorkspaceCreateRequestDto, "stackTags" | "visibility">> & {
		userId: number;
	};

export { type WorkspaceCreatePayload };
