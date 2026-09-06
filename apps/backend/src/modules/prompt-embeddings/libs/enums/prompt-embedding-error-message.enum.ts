const PromptEmbeddingErrorMessage = {
	EMPTY_RESULT: "The embedding model returned no Embedding for the prompt.",
	RESULT_COUNT_MISMATCH:
		"The embedding model returned a different number of Embeddings than texts.",
	SCHEMA_COLUMN_MISSING:
		"The prompt embeddings column was not found — run the migrations.",
} as const;

export { PromptEmbeddingErrorMessage };
