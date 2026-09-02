const SCORE_DESCRIPTIONS: Record<number, string> = {
	1: "1 · Completely useless / Hallucinated heavily",
	2: "2 · Code was completely broken / failed to run",
	3: "3 · Required major manual fixes to work",
	4: "4 · Required moderate manual fixes",
	5: "5 · Mediocre / Acceptable but not optimal",
	6: "6 · Good, but required minor tweaks",
	7: "7 · Very good, mostly usable out of the box",
	8: "8 · Great, fully functional as requested",
	9: "9 · Excellent, exceeded expectations with best practices",
	10: "10 · Flawless, perfect context and execution",
} as const;

export { SCORE_DESCRIPTIONS };
