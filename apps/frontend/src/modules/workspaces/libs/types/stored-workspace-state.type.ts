import { type StoredWorkspaceStatus } from "../enums/enums.js";

type LoadingWorkspaceState = {
	status: typeof StoredWorkspaceStatus.LOADING;
};

type ResolvedWorkspaceState = {
	status: typeof StoredWorkspaceStatus.RESOLVED;
	workspaceId: null | number;
};

type StoredWorkspaceState = LoadingWorkspaceState | ResolvedWorkspaceState;

export { type StoredWorkspaceState };
