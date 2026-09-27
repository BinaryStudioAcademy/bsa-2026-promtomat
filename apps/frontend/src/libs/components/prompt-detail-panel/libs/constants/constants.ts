import { PromptDetailBodyView, PromptDetailLabel } from "../enums/enums.js";

const BODY_HEIGHT_PX = 200;

const BODY_VIEW_OPTIONS = [
	{
		label: PromptDetailLabel.PREVIEW,
		value: PromptDetailBodyView.PREVIEW,
	},
	{
		label: PromptDetailLabel.WRITE,
		value: PromptDetailBodyView.WRITE,
	},
] as const;

export { BODY_HEIGHT_PX, BODY_VIEW_OPTIONS };
