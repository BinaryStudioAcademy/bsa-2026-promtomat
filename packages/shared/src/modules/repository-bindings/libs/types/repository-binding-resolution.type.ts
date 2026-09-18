import { type RepositoryBindingResolutionStatus } from "../enums/enums.js";
import { type RepositoryBindingCandidateWorkspace } from "./repository-binding-candidate-workspace.type.js";

type RepositoryBindingResolution =
	| {
			status: typeof RepositoryBindingResolutionStatus.AMBIGUOUS;
			workspaces: RepositoryBindingCandidateWorkspace[];
	  }
	| {
			status: typeof RepositoryBindingResolutionStatus.RESOLVED;
			workspaceId: number;
	  }
	| { status: typeof RepositoryBindingResolutionStatus.UNRESOLVED };

export { type RepositoryBindingResolution };
