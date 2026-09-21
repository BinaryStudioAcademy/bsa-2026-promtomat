import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const GIT_COMMAND = "git";
const REMOTE_ORIGIN_ARGUMENTS = ["remote", "get-url", "origin"];

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
