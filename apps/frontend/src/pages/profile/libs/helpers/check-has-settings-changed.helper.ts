import { type SettingsFormValues } from "../types/types.js";

type Parameters = {
	current: SettingsFormValues;
	next: SettingsFormValues;
};

const checkHasSettingsChanged = ({ current, next }: Parameters): boolean => {
	return (
		next.nickname.trim() !== current.nickname ||
		next.primaryAiCodingTool !== current.primaryAiCodingTool
	);
};

export { checkHasSettingsChanged };
