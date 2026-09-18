import { WORKSPACES_PAGE_COPY } from "../constants/constants.js";
import { type ShellPageCopy } from "../types/types.js";
import { checkIsShellPageCopy } from "./check-is-shell-page-copy.helper.js";

type RouteMatchWithHandle = {
	handle?: unknown;
};

const resolveShellPageCopy = (
	matches: readonly RouteMatchWithHandle[],
): ShellPageCopy => {
	const matchedHandle = matches
		.map((match) => match.handle)
		.findLast((handle): handle is ShellPageCopy =>
			checkIsShellPageCopy(handle),
		);

	return matchedHandle ?? WORKSPACES_PAGE_COPY;
};

export { resolveShellPageCopy };
