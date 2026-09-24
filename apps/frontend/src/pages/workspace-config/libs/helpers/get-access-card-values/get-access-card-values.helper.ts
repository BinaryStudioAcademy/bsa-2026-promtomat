import {
	type WorkspaceContributorsResponseDto,
	type WorkspaceUserSummaryDto,
} from "~/modules/workspaces/libs/types/types.js";

import { SOLO_MEMBER_COUNT } from "../../constants/constants.js";

type AccessCardValues = {
	contributorCount: string;
	contributors: WorkspaceUserSummaryDto[];
	subtitle: string;
};

type Parameters = {
	contributorsResponse: undefined | WorkspaceContributorsResponseDto;
	isError: boolean;
	isOwner: boolean;
};

const getAccessCardValues = ({
	contributorsResponse,
	isError,
	isOwner,
}: Parameters): AccessCardValues => {
	const contributors = contributorsResponse?.contributors ?? [];
	const members =
		contributorsResponse && !isError
			? [contributorsResponse.owner, ...contributorsResponse.contributors]
			: undefined;
	const memberLabel =
		members?.length === SOLO_MEMBER_COUNT ? "member" : "members";
	const ownerLabel = isOwner ? "you" : contributorsResponse?.owner.nickname;
	const fallbackSubtitle = isOwner ? "Owned by you" : "Members";
	const subtitle =
		members && ownerLabel
			? `Owned by ${ownerLabel} · ${String(members.length)} ${memberLabel}`
			: fallbackSubtitle;
	const contributorCount =
		contributorsResponse && !isError
			? String(contributorsResponse.contributors.length)
			: "–";

	return { contributorCount, contributors, subtitle };
};

export { getAccessCardValues };
