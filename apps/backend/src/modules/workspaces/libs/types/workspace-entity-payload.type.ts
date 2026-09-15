import { type WorkspaceDto } from "./types.js";

type WorkspaceEntityPayload = Omit<WorkspaceDto, "id"> & { id: null | number };

export { type WorkspaceEntityPayload };
