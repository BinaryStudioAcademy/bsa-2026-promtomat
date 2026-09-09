const buildDimensionMismatchMessage = (
	schemaDimension: number,
	configuredDimension: number,
): string =>
	`The prompt embeddings column is vector(${schemaDimension.toString()}) while EMBEDDING_DIMENSIONS is ${configuredDimension.toString()}.`;

export { buildDimensionMismatchMessage };
