const ComposeResultMessage = {
	COMPOSED_AT_LABEL: "Composed at:",
	COMPOSED_HEADLINE:
		"COMPOSED PROMPT. Promptomat generated it just for this task from stored prompts. It is not a stored prompt, and nobody has run or rated it yet.",
	COMPOSED_ID_LABEL: "Promptomat composed prompt id:",
	COMPOSED_ID_NOTE:
		"It is saved in Promptomat under this id, so the person you are working for can find it there later.",
	COMPOSED_PROMPT_BEGIN: "----- BEGIN COMPOSED PROMPT -----",
	COMPOSED_PROMPT_END: "----- END COMPOSED PROMPT -----",
	COMPOSED_USAGE_HINT:
		"Use it as a starting point and adapt it to the repository.",
	EXPLANATION_LABEL: "Why this prompt:",
	FALLBACK_EXPLANATION:
		"This is the closest stored prompt in the workspace. A person wrote it and it is shown as saved; it was not generated for this task.",
	FALLBACK_HEADLINE:
		"STORED PROMPT, NOT COMPOSED. Promptomat could not compose a new prompt because",
	FALLBACK_PROMPT_BEGIN: "----- BEGIN STORED PROMPT -----",
	FALLBACK_PROMPT_END: "----- END STORED PROMPT -----",
	FALLBACK_USAGE_HINT:
		"Use it as a reference and adapt it to the repository and the task.",
	NO_MATCHES:
		"NO MATCHING PROMPTS. This workspace has no stored prompt similar enough to this task, so nothing was composed. Continue without one. Recording prompts on the Training page in Promptomat gives future tasks more to compose from.",
	NO_SOURCES: "It does not cite any stored prompt.",
	PROMPT_URL_LABEL: "Open it in Promptomat:",
	SCORE_LABEL: "Score recorded for it:",
	SOURCES_LABEL: "Stored prompts it was composed from:",
	STORED_PROMPT_LABEL: "Stored prompt:",
} as const;

export { ComposeResultMessage };
