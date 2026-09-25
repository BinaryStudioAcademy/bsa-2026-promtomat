import { type RepositoryBindingResolutionStatus } from "../enums/enums.js";
import { type RepositoryBindingCandidateWorkspace } from "./repository-binding-candidate-workspace.type.js";

type AmbiguousRepositoryBindingResolution = {
	status: typeof RepositoryBindingResolutionStatus.AMBIGUOUS;
	workspaces: RepositoryBindingCandidateWorkspace[];
};

type RepositoryBindingResolution =
	| AmbiguousRepositoryBindingResolution
	| ResolvedRepositoryBindingResolution
	| UnresolvedRepositoryBindingResolution;

type ResolvedRepositoryBindingResolution = {
	status: typeof RepositoryBindingResolutionStatus.RESOLVED;
	workspaceId: number;
};

type UnresolvedRepositoryBindingResolution = {
	status: typeof RepositoryBindingResolutionStatus.UNRESOLVED;
	workspaces: RepositoryBindingCandidateWorkspace[];
};

export { type RepositoryBindingResolution };
