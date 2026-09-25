import { PackageNameToTechStackTag } from "../enums/enums.js";

type PackageJsonManifest = {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
};

const parsePackageJson = (
	packageJsonContent: string,
): null | PackageJsonManifest => {
	try {
		const manifest: unknown = JSON.parse(packageJsonContent);

		return typeof manifest === "object" && manifest !== null ? manifest : null;
	} catch {
		return null;
	}
};

const detectStackTagsFromPackageJson = (
	packageJsonContent: string,
): string[] => {
	const manifest = parsePackageJson(packageJsonContent);

	if (!manifest) {
		return [];
	}

	const packageNames = [
		...Object.keys(manifest.dependencies ?? {}),
		...Object.keys(manifest.devDependencies ?? {}),
	];

	const detectedTags = packageNames
		.map((packageName) => PackageNameToTechStackTag[packageName])
		.filter((tag): tag is string => Boolean(tag));

	return [...new Set(detectedTags)];
};

export { detectStackTagsFromPackageJson };
