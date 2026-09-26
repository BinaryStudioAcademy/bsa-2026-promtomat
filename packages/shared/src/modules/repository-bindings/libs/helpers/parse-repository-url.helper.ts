import { SCP_LIKE_PATTERN, URL_LIKE_PATTERN } from "../constants/constants.js";

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
