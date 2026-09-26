import {
	FIRST_ELEMENT_INDEX,
	MAX_TAGS_COUNT,
} from "../../../workspaces/libs/modules/tech-stack-tags/tech-stack-tags.js";
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
		.filter(
			(packageName): packageName is keyof typeof PackageNameToTechStackTag =>
				Object.hasOwn(PackageNameToTechStackTag, packageName),
		)
		.map((packageName) => PackageNameToTechStackTag[packageName]);

	return [...new Set(detectedTags)].slice(FIRST_ELEMENT_INDEX, MAX_TAGS_COUNT);
};

export { detectStackTagsFromPackageJson };
