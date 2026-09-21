import { readFile } from "node:fs/promises";
import path from "node:path";

const PACKAGE_JSON_FILE_NAME = "package.json";

const readPackageJson = async (
	projectDirectory: string,
): Promise<null | string> => {
	try {
		return await readFile(
			path.join(projectDirectory, PACKAGE_JSON_FILE_NAME),
			"utf8",
		);
	} catch {
		return null;
	}
};

export { readPackageJson };
