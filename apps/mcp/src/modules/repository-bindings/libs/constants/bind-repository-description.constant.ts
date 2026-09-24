const BIND_REPOSITORY_DESCRIPTION =
	"Bind this checkout's repository to a Promptomat workspace, so future tool calls resolve to it. Call it after resolve-repository reports the checkout as unresolved or ambiguous, passing the workspaceId to bind to. Detects the project's technologies from package.json and records them on the workspace.";

export { BIND_REPOSITORY_DESCRIPTION };
