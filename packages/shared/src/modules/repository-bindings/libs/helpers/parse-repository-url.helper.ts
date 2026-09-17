const SCP_LIKE_PATTERN = /^[^/@]+@([^:/]+):(.+)$/;
const URL_LIKE_PATTERN =
	/^(?:[a-z][a-z0-9+.-]*):\/\/(?:[^/@]*@)?([^/:]+)(?::\d+)?\/(.+)$/i;

type ParsedRepositoryUrl = {
	host: string;
	path: string;
};

const parseRepositoryUrl = (remoteUrl: string): null | ParsedRepositoryUrl => {
	const scpMatch = SCP_LIKE_PATTERN.exec(remoteUrl);
	const [, scpHost, scpPath] = scpMatch ?? [];

	if (scpHost && scpPath) {
		return { host: scpHost, path: scpPath };
	}

	const urlMatch = URL_LIKE_PATTERN.exec(remoteUrl);
	const [, urlHost, urlPath] = urlMatch ?? [];

	if (urlHost && urlPath) {
		return { host: urlHost, path: urlPath };
	}

	return null;
};

export { parseRepositoryUrl };
