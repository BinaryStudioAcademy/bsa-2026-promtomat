import { type WorkspaceCreateRequestDto } from "@promptomat/shared";

type WorkspaceCreatePayload = Omit<
	WorkspaceCreateRequestDto,
	"stackTags" | "visibility"
> &
	Partial<WorkspaceCreateRequestDto> & {
		userId: number;
	};

export { type WorkspaceCreatePayload };
