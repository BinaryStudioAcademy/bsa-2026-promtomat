const ShellPageCopy = {
	GENERATE: {
		subtitle: "Compose a new prompt from what already worked",
		title: "Generate",
	},
	PROFILE: {
		subtitle: "Account details and prompt activity",
		title: "Profile",
	},
	SETTINGS: {
		subtitle: "Update your account details and security",
		title: "Settings",
	},
	SMART_SEARCH: {
		subtitle: "Retrieve and browse every prompt your team logged",
		title: "Smart search",
	},
	TRAINING: {
		subtitle: "Log a prompt and score how well it worked",
		title: "Training",
	},
	WORKSPACES: {
		subtitle: "One workspace per codebase",
		title: "Workspaces",
	},
} as const;

type ShellPageCopyValue = (typeof ShellPageCopy)[keyof typeof ShellPageCopy];

export { type ShellPageCopyValue, ShellPageCopy };
