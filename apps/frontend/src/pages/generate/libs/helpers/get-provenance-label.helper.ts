import { SINGLE_SOURCE_COUNT } from "../constants/constants.js";
import { GenerateLabel } from "../enums/enums.js";

type Parameters = {
	sourceCount: number;
	workspaceName: string | undefined;
};

const getProvenanceLabel = ({
	sourceCount,
	workspaceName,
}: Parameters): string => {
	const noun =
		sourceCount === SINGLE_SOURCE_COUNT
			? GenerateLabel.STORED_PROMPT_ONE
			: GenerateLabel.STORED_PROMPTS_MANY;
	const origin = [GenerateLabel.PROVENANCE_FROM, String(sourceCount), noun];

	if (workspaceName) {
		origin.push(GenerateLabel.PROVENANCE_IN, workspaceName);
	}

	return origin.join(" ");
};

export { getProvenanceLabel };
