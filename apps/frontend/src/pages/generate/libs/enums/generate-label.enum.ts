const GenerateLabel = {
	COPY_PROMPT: "Copy prompt",
	DESCRIPTION_FIELD: "Task description",
	DESCRIPTION_PLACEHOLDER:
		"Describe your coding task (e.g., Implement middleware session validation)",
	FALLBACK_KICKER: "Closest stored prompt",
	GENERATED_KICKER: "Generated",
	OPEN_IN_LOG: "Open in log",
	PAGE_DESCRIPTION:
		"Describe the task. Promptomat assembles a new prompt out of the highest-scoring stored prompts in the workspace and shows you which ones it drew from.",
	PAGE_LABEL: "Generate",
	PAGE_TITLE: "Compose a prompt from what already worked",
	PROVENANCE_FROM: "From",
	PROVENANCE_IN: "in",
	RATE_HEADING: "Rate this prompt",
	RECORD_PROMPT_LINK: "Record a prompt",
	RETRY: "Retry",
	STORED_PROMPT_ONE: "stored prompt",
	STORED_PROMPTS_MANY: "stored prompts",
	SUBMIT: "Generate",
	SUBMITTING: "Generating",
	TRY_AGAIN: "Try again",
	WORKSPACE_CAPTION: "Generating in",
	WORKSPACE_FIELD: "Workspace",
	WORKSPACE_PLACEHOLDER: "Select workspace",
} as const;

export { GenerateLabel };
