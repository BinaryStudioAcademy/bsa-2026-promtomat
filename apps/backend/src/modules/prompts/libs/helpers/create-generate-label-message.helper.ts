const createGenerateLabelMessage = (
	prompt: string,
	existingLabels: string[],
): string => {
	return `
Generate short, one-word label for the following prompt: ${prompt},
Before generation, check whether the following existing labels match:
${existingLabels.join(",")}
If one of them match, return it without generation.
If nothing match, make sure that newly generated value does not have same meaning with existing labels, for example:
Auth => Authentification
Filters => Filtering
`;
};

export { createGenerateLabelMessage };
