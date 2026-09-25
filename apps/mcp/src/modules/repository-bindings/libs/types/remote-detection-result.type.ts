import { type RemoteDetectionStatus } from "../enums/enums.js";

type RemoteDetectionResult =
	| { remoteNames: string[]; status: typeof RemoteDetectionStatus.AMBIGUOUS }
	| { remoteUrl: string; status: typeof RemoteDetectionStatus.SINGLE }
	| { status: typeof RemoteDetectionStatus.NONE };

export { type RemoteDetectionResult };
