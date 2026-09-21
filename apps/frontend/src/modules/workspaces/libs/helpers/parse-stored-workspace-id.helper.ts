const parseStoredWorkspaceId = (value: null | string): null | number => {
	if (value === null) {
		return null;
	}

	const workspaceId = Number(value);

	return Number.isNaN(workspaceId) ? null : workspaceId;
};

export { parseStoredWorkspaceId };
