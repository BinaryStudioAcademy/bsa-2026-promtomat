import { type WorkspaceCreateRequestDto } from "./types.js";

type WorkspaceCreatePayload = Omit<
	WorkspaceCreateRequestDto,
	WorkspaceDefaultedField
> &
	Partial<Pick<WorkspaceCreateRequestDto, WorkspaceDefaultedField>> & {
		userId: number;
	};

type WorkspaceDefaultedField = "description" | "stackTags" | "visibility";

export { type WorkspaceCreatePayload };
