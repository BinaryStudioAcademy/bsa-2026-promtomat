import { type ValueOf } from "../../../../libs/types/value-of.type.js";
import {
	FIRST_SEGMENT_INDEX,
	LAST_SEGMENT_OFFSET,
	MINIMUM_PATH_SEGMENTS,
	TRAILING_GIT_SUFFIX_PATTERN,
} from "../constants/constants.js";
import { RepositoryIdentityRefusalReason } from "../enums/enums.js";
import { type RepositoryIdentityOutcome } from "../types/types.js";
import { parseRepositoryUrl } from "./parse-repository-url.helper.js";

const refuse = (
	reason: ValueOf<typeof RepositoryIdentityRefusalReason>,
): RepositoryIdentityOutcome => ({ identity: null, reason });

const normalizeRepositoryIdentity = (
	remoteUrl: string | undefined,
): RepositoryIdentityOutcome => {
	const trimmedUrl = remoteUrl?.trim();

	if (!trimmedUrl) {
		return refuse(RepositoryIdentityRefusalReason.NO_REMOTE_CONFIGURED);
	}

	const parsed = parseRepositoryUrl(trimmedUrl);

	if (!parsed) {
		return refuse(RepositoryIdentityRefusalReason.UNRECOGNIZED_FORMAT);
	}

	const trimmedPath = parsed.path.replace(TRAILING_GIT_SUFFIX_PATTERN, "");
	const segments = trimmedPath.split("/").filter(Boolean);

	if (segments.length < MINIMUM_PATH_SEGMENTS) {
		return refuse(RepositoryIdentityRefusalReason.UNRECOGNIZED_FORMAT);
	}

	const repo = segments.at(LAST_SEGMENT_OFFSET);
	const owner = segments
		.slice(FIRST_SEGMENT_INDEX, LAST_SEGMENT_OFFSET)
		.join("/");

	if (!repo || !owner) {
		return refuse(RepositoryIdentityRefusalReason.UNRECOGNIZED_FORMAT);
	}

	return {
		identity: {
			host: parsed.host.toLowerCase(),
			owner: owner.toLowerCase(),
			repo: repo.toLowerCase(),
		},
		reason: null,
	};
};

export { normalizeRepositoryIdentity };
