const RecordPromptFormMessage = {
	INTENT_LABEL: "Task intent",
	INTENT_PLACEHOLDER: "e.g. JWT authentication on FastAPI",
	SCORE_LABEL: "Efficiency score",
	SCORE_NOTE:
		"A score from 1 to 10 is part of the log request, so a prompt cannot be logged without one.",
	SCORE_NOTE_TAG: "Required",
} as const;

export { RecordPromptFormMessage };
