import { type RepositoryBindingResolutionStatus } from "../enums/enums.js";

type RepositoryBindingResolution =
	| {
			status: typeof RepositoryBindingResolutionStatus.AMBIGUOUS;
			workspaceIds: number[];
	  }
	| {
			status: typeof RepositoryBindingResolutionStatus.RESOLVED;
			workspaceId: number;
	  }
	| { status: typeof RepositoryBindingResolutionStatus.UNRESOLVED };

export { type RepositoryBindingResolution };
