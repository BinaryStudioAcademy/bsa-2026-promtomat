import { type ComposeRequestDto } from "~/modules/composed-prompts/composed-prompts.js";

const checkIsSameComposeRequest = (
	previous: ComposeRequestDto | null,
	next: ComposeRequestDto,
): boolean => {
	return (
		previous !== null &&
		previous.description === next.description &&
		previous.workspaceId === next.workspaceId
	);
};

export { checkIsSameComposeRequest };
