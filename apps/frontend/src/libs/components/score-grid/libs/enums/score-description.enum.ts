import { Score } from "./score.enum.js";

const ScoreDescription: Record<number, string> = {
	[Score.EIGHT]: "8 · Great, fully functional as requested",
	[Score.FIVE]: "5 · Mediocre / Acceptable but not optimal",
	[Score.FOUR]: "4 · Required moderate manual fixes",
	[Score.NINE]: "9 · Excellent, exceeded expectations with best practices",
	[Score.ONE]: "1 · Completely useless / Hallucinated heavily",
	[Score.SEVEN]: "7 · Very good, mostly usable out of the box",
	[Score.SIX]: "6 · Good, but required minor tweaks",
	[Score.TEN]: "10 · Flawless, perfect context and execution",
	[Score.THREE]: "3 · Required major manual fixes to work",
	[Score.TWO]: "2 · Code was completely broken / failed to run",
} as const;

export { ScoreDescription };
