const ToolOutcome = {
	BACKEND_ERROR: "backend_error",
	OK: "ok",
	TOKEN_REJECTED: "token_rejected",
	UNEXPECTED: "unexpected",
	UNEXPECTED_RESPONSE: "unexpected_response",
	UNREACHABLE: "unreachable",
} as const;

export { ToolOutcome };
