import { type RepositoryBindingResolutionStatus } from "../enums/enums.js";
import { type RepositoryBindingCandidateWorkspace } from "./repository-binding-candidate-workspace.type.js";

type AmbiguousRepositoryBindingResolution = {
	status: typeof RepositoryBindingResolutionStatus.AMBIGUOUS;
	workspaces: RepositoryBindingCandidateWorkspace[];
};

type RepositoryBindingResolution =
	| AmbiguousRepositoryBindingResolution
	| ResolvedRepositoryBindingResolution
	| { status: typeof RepositoryBindingResolutionStatus.UNRESOLVED };

type ResolvedRepositoryBindingResolution = {
	status: typeof RepositoryBindingResolutionStatus.RESOLVED;
	workspaceId: number;
};

export { type RepositoryBindingResolution };
