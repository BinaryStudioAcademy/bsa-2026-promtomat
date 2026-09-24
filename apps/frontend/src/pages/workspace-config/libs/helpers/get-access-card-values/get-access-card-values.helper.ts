import {
	type WorkspaceContributorsResponseDto,
	type WorkspaceUserSummaryDto,
} from "~/modules/workspaces/libs/types/types.js";

import { SOLO_MEMBER_COUNT } from "../../constants/constants.js";

const getAccessCardValues = ({
	data,
	isError,
	isOwner,
}: {
	data: undefined | WorkspaceContributorsResponseDto;
	isError: boolean;
	isOwner: boolean;
}): {
	contributorCount: string;
	contributors: WorkspaceUserSummaryDto[];
	subtitle: string;
} => {
	const contributors = data?.contributors ?? [];
	const members =
		data && !isError ? [data.owner, ...data.contributors] : undefined;
	const memberLabel =
		members?.length === SOLO_MEMBER_COUNT ? "member" : "members";
	const ownerLabel = isOwner ? "you" : data?.owner.nickname;
	const fallbackSubtitle = isOwner ? "Owned by you" : "Members";
	const subtitle =
		members && ownerLabel
			? `Owned by ${ownerLabel} · ${String(members.length)} ${memberLabel}`
			: fallbackSubtitle;
	const contributorCount =
		data && !isError ? String(data.contributors.length) : "–";

	return { contributorCount, contributors, subtitle };
};

export { getAccessCardValues };
