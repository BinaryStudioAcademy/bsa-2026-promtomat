import { ScoreTone } from "../enums/enums.js";
import { type DistributionTier } from "../types/types.js";

const DISTRIBUTION_TIERS: DistributionTier[] = [
	{
		description: "Flawless code out of the box, zero edits needed",
		key: "high",
		label: "High",
		range: "8-10",
		tone: ScoreTone.SUCCESS,
	},
	{
		description: "Required heavy manual refactoring",
		key: "mid",
		label: "Mid",
		range: "4-7",
		tone: ScoreTone.WARNING,
	},
	{
		description: "Code was completely broken / failed to run",
		key: "low",
		label: "Low",
		range: "1-3",
		tone: ScoreTone.DANGER,
	},
];

export { DISTRIBUTION_TIERS };
