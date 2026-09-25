import { type RemoteDetectionStatus } from "../enums/enums.js";

type RemoteDetectionResult =
	| { remoteNames: string[]; status: typeof RemoteDetectionStatus.AMBIGUOUS }
	| { status: typeof RemoteDetectionStatus.NONE }
	| { remoteUrl: string; status: typeof RemoteDetectionStatus.SINGLE };

export { type RemoteDetectionResult };
