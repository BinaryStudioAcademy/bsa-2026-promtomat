import { TechStackTechDictionary } from "./tech-stack-dictionary.enum.js";
import { TechStackVariants } from "./tech-stack-variants.enum.js";

const variantEntries: [string, string][] = Object.entries(
	TechStackVariants,
).flatMap(([canonical, variants]) =>
	variants.map((variant): [string, string] => [
		variant.toLowerCase(),
		canonical,
	]),
);

const canonicalEntries: [string, string][] = Object.values(
	TechStackTechDictionary,
).map((canonical): [string, string] => [canonical.toLowerCase(), canonical]);

const VariantToCanonical: Record<string, string> = Object.fromEntries([
	...variantEntries,
	...canonicalEntries,
]);

export { VariantToCanonical };
