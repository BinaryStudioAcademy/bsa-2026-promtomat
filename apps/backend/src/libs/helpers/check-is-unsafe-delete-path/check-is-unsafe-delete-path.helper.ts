import os from "node:os";
import path from "node:path";

const checkIsUnsafeDeletePath = (value: string): boolean => {
	const resolvedPath = path.resolve(value);
	const workingDirectory = process.cwd();

	return (
		resolvedPath === path.parse(resolvedPath).root ||
		resolvedPath === os.homedir() ||
		resolvedPath === workingDirectory ||
		workingDirectory.startsWith(resolvedPath + path.sep)
	);
};

export { checkIsUnsafeDeletePath };
