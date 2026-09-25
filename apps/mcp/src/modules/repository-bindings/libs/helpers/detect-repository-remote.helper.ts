import {
	normalizeRepositoryIdentity,
	type RepositoryIdentity,
} from "@promptomat/shared";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import {
	EMPTY_LENGTH,
	FIRST_ELEMENT_INDEX,
	GET_REMOTE_URL_ARGUMENTS_PREFIX,
	GIT_COMMAND,
	LIST_REMOTES_ARGUMENTS,
	SINGLE_IDENTITY_COUNT,
} from "../constants/constants.js";
import { RemoteDetectionStatus } from "../enums/enums.js";
import { type RemoteDetectionResult } from "../types/types.js";

const FETCH_REMOTE_LINE_PATTERN = /^(\S+)\s+(\S+)\s+\(fetch\)$/;

type GitRemote = {
	name: string;
	url: string;
};

type IdentifiedRemote = {
	identity: RepositoryIdentity;
	remote: GitRemote;
};

const execFileAsync = promisify(execFile);

const parseRemotesOutput = (stdout: string): GitRemote[] => {
	const remotes: GitRemote[] = [];

	for (const line of stdout.split("\n")) {
		const match = FETCH_REMOTE_LINE_PATTERN.exec(line.trim());
		const [, name, url] = match ?? [];

		if (name && url) {
			remotes.push({ name, url });
		}
	}

	return remotes;
};

const listRemotes = async (projectDirectory: string): Promise<GitRemote[]> => {
	try {
		const { stdout } = await execFileAsync(
			GIT_COMMAND,
			LIST_REMOTES_ARGUMENTS,
			{ cwd: projectDirectory },
		);

		return parseRemotesOutput(stdout);
	} catch {
		return [];
	}
};

const getRemoteUrlByName = async (
	projectDirectory: string,
	remoteName: string,
): Promise<null | string> => {
	try {
		const { stdout } = await execFileAsync(
			GIT_COMMAND,
			[...GET_REMOTE_URL_ARGUMENTS_PREFIX, remoteName],
			{ cwd: projectDirectory },
		);

		return stdout.trim();
	} catch {
		return null;
	}
};

const toIdentityKey = (identity: RepositoryIdentity): string =>
	`${identity.host}/${identity.owner}/${identity.repo}`;

const detectRepositoryRemote = async (
	projectDirectory: string,
	remoteName?: string,
): Promise<RemoteDetectionResult> => {
	if (remoteName) {
		const remoteUrl = await getRemoteUrlByName(projectDirectory, remoteName);

		return remoteUrl
			? { remoteUrl, status: RemoteDetectionStatus.SINGLE }
			: { status: RemoteDetectionStatus.NONE };
	}

	const remotes = await listRemotes(projectDirectory);

	const identifiedRemotes: IdentifiedRemote[] = [];

	for (const remote of remotes) {
		const { identity } = normalizeRepositoryIdentity(remote.url);

		if (identity) {
			identifiedRemotes.push({ identity, remote });
		}
	}

	if (identifiedRemotes.length === EMPTY_LENGTH) {
		return { status: RemoteDetectionStatus.NONE };
	}

	const uniqueIdentityKeys = new Set(
		identifiedRemotes.map((entry) => toIdentityKey(entry.identity)),
	);

	if (uniqueIdentityKeys.size === SINGLE_IDENTITY_COUNT) {
		const firstIdentifiedRemote = identifiedRemotes[
			FIRST_ELEMENT_INDEX
		] as IdentifiedRemote;

		return {
			remoteUrl: firstIdentifiedRemote.remote.url,
			status: RemoteDetectionStatus.SINGLE,
		};
	}

	return {
		remoteNames: identifiedRemotes.map((entry) => entry.remote.name),
		status: RemoteDetectionStatus.AMBIGUOUS,
	};
};

export { detectRepositoryRemote };
