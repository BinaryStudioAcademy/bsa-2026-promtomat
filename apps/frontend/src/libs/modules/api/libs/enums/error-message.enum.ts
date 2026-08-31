const ErrorMessage = {
	EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
	FORBIDDEN: "You do not have access to this.",
	INVALID_CREDENTIALS: "Invalid email or password.",
	NETWORK: "Can't reach the server. Check your connection and try again.",
	NOT_FOUND: "We couldn't find what you were looking for.",
	SESSION_EXPIRED: "Your session has expired. Please sign in again.",
	UNAUTHORIZED: "Please log in to view this content.",
	UNKNOWN: "Something went wrong. Please try again.",
	VALIDATION: "Please check the highlighted fields and try again.",
} as const;

export { ErrorMessage };
