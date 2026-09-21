type Resolution =
	| { status: "ambiguous"; workspaces: ResolutionWorkspace[] }
	| { status: "resolved"; workspaceId: number }
	| { status: "unresolved" };

type ResolutionWorkspace = {
	id: number;
	name: string;
};

export { type Resolution, type ResolutionWorkspace };
