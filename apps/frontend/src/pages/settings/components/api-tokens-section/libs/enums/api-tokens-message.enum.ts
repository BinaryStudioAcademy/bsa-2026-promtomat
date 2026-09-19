const ApiTokensMessage = {
	CLOSE_WITHOUT_COPY:
		"The token value is gone — it is shown only once. If you did not copy it, revoke this token and generate a new one.",
	CONNECT_HINT:
		"Paste this value into the Promptomat MCP server configuration when you connect a coding agent.",
	COPIED: "Token copied to clipboard.",
	COPY: "Copy",
	COPY_FAILED:
		"Could not copy automatically. Select the value and copy it manually.",
	CREATE: "Generate token",
	CREATE_ERROR: "Could not create the token.",
	CREATED_TITLE: "Your new token",
	DIALOG_CLOSE: "Done",
	DIALOG_CLOSE_UNCOPIED: "Close without copying",
	EMPTY: "You have no API tokens yet. Generate one to connect a coding agent.",
	LAST_USED_NEVER: "Never used",
	LOADING: "Loading tokens",
	NAME_LABEL: "Token name",
	NAME_PLACEHOLDER: "My laptop",
	ONE_TIME_WARNING:
		"Copy it now. This value is shown once and cannot be recovered afterwards.",
	REVOKE: "Revoke",
	REVOKE_CONFIRM:
		"Anything using this token will immediately lose access. This cannot be undone.",
	REVOKE_TITLE: "Revoke token",
	REVOKED: "Token revoked.",
	SECTION_DESCRIPTION:
		"API tokens let a coding agent call Promptomat on your behalf.",
	SECTION_TITLE: "API tokens",
} as const;

export { ApiTokensMessage };
