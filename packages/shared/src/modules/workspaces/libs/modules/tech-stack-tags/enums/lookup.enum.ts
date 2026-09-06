import { TECH_STACK_DICTIONARY } from "./dictionary.enum.js";
import { TECH_STACK_VARIANTS } from "./variants.enum.js";

const variantEntries: [string, string][] = Object.entries(
	TECH_STACK_VARIANTS,
).flatMap(([canonical, variants]) =>
	variants.map((variant): [string, string] => [
		variant.toLowerCase(),
		canonical,
	]),
);

const canonicalEntries: [string, string][] = Object.values(
	TECH_STACK_DICTIONARY,
).map((canonical): [string, string] => [canonical.toLowerCase(), canonical]);

const VARIANT_TO_CANONICAL: Record<string, string> = Object.fromEntries([
	...variantEntries,
	...canonicalEntries,
]);

export { VARIANT_TO_CANONICAL };
