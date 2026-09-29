const resolveWebUrl = (webUrl: string, apiUrl: string): string => {
	return webUrl === "" ? new URL(apiUrl).origin : webUrl;
};

export { resolveWebUrl };
