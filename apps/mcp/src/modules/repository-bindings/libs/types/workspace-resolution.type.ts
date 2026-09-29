import { type WorkspaceResolutionStatus } from "../enums/enums.js";
import { type RepositoryBindingCandidateWorkspace } from "./types.js";

type RemoteAmbiguousResolution = {
	remoteNames: string[];
	status: typeof WorkspaceResolutionStatus.REMOTE_AMBIGUOUS;
};

type RemoteNoneResolution = {
	status: typeof WorkspaceResolutionStatus.REMOTE_NONE;
};

type ResolvedResolution = {
	status: typeof WorkspaceResolutionStatus.RESOLVED;
	workspaceId: number;
};

type WorkspaceAmbiguousResolution = {
	status: typeof WorkspaceResolutionStatus.WORKSPACE_AMBIGUOUS;
	workspaces: RepositoryBindingCandidateWorkspace[];
};

type WorkspaceResolution =
	| RemoteAmbiguousResolution
	| RemoteNoneResolution
	| ResolvedResolution
	| WorkspaceAmbiguousResolution
	| WorkspaceUnresolvedResolution;

type WorkspaceUnresolvedResolution = {
	status: typeof WorkspaceResolutionStatus.WORKSPACE_UNRESOLVED;
	workspaces: RepositoryBindingCandidateWorkspace[];
};

export { type WorkspaceResolution };
