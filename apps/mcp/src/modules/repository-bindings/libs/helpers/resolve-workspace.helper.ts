import {
	RemoteDetectionStatus,
	RepositoryBindingResolutionStatus,
	WorkspaceResolutionStatus,
} from "../enums/enums.js";
import {
	type ResolveWorkspaceOptions,
	type WorkspaceResolution,
} from "../types/types.js";
import { detectRepositoryRemote } from "./detect-repository-remote.helper.js";

const resolveWorkspace = async ({
	projectDirectory,
	remoteName,
	repositoryBindingApi,
}: ResolveWorkspaceOptions): Promise<WorkspaceResolution> => {
	const detection = await detectRepositoryRemote(projectDirectory, remoteName);

	if (detection.status === RemoteDetectionStatus.NONE) {
		return { status: WorkspaceResolutionStatus.REMOTE_NONE };
	}

	if (detection.status === RemoteDetectionStatus.AMBIGUOUS) {
		return {
			remoteNames: detection.remoteNames,
			status: WorkspaceResolutionStatus.REMOTE_AMBIGUOUS,
		};
	}

	const resolution = await repositoryBindingApi.resolve(detection.remoteUrl);

	if (resolution.status === RepositoryBindingResolutionStatus.RESOLVED) {
		return {
			status: WorkspaceResolutionStatus.RESOLVED,
			workspaceId: resolution.workspaceId,
		};
	}

	if (resolution.status === RepositoryBindingResolutionStatus.AMBIGUOUS) {
		return {
			status: WorkspaceResolutionStatus.WORKSPACE_AMBIGUOUS,
			workspaces: resolution.workspaces,
		};
	}

	return {
		status: WorkspaceResolutionStatus.WORKSPACE_UNRESOLVED,
		workspaces: resolution.workspaces,
	};
};

export { resolveWorkspace };
