import { ShellPageCopy } from "../enums/enums.js";
import { type ShellPageCopyValue } from "../types/types.js";
import { checkIsShellPageCopy } from "./check-is-shell-page-copy.helper.js";

type RouteMatchWithHandle = {
	handle?: unknown;
};

const resolveShellPageCopy = (
	matches: readonly RouteMatchWithHandle[],
): ShellPageCopyValue => {
	const matchedHandle = matches
		.map((match) => match.handle)
		.findLast((handle): handle is ShellPageCopyValue =>
			checkIsShellPageCopy(handle),
		);

	return matchedHandle ?? ShellPageCopy.WORKSPACES;
};

export { resolveShellPageCopy };
