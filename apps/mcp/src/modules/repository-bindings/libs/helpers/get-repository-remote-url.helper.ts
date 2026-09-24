import { execFile } from "node:child_process";
import { promisify } from "node:util";

import {
	GIT_COMMAND,
	REMOTE_ORIGIN_ARGUMENTS,
} from "../constants/constants.js";

const execFileAsync = promisify(execFile);

const getRepositoryRemoteUrl = async (
	projectDirectory: string,
): Promise<null | string> => {
	try {
		const { stdout } = await execFileAsync(
			GIT_COMMAND,
			REMOTE_ORIGIN_ARGUMENTS,
			{ cwd: projectDirectory },
		);

		return stdout.trim();
	} catch {
		return null;
	}
};

export { getRepositoryRemoteUrl };
