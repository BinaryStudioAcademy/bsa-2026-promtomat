import { type StreakSummary } from "~/pages/training/components/logging-streak/libs/types/types.js";

const STREAK_PREVIEW: StreakSummary = {
	currentStreak: 10,
	days: [
		{ date: "2026-09-08", id: 1, logCount: 0 },
		{ date: "2026-09-09", id: 2, logCount: 0 },
		{ date: "2026-09-10", id: 3, logCount: 4 },
		{ date: "2026-09-11", id: 4, logCount: 1 },
		{ date: "2026-09-12", id: 5, logCount: 3 },
		{ date: "2026-09-13", id: 6, logCount: 5 },
		{ date: "2026-09-14", id: 7, logCount: 3 },
		{ date: "2026-09-15", id: 8, logCount: 6 },
		{ date: "2026-09-16", id: 9, logCount: 1 },
		{ date: "2026-09-17", id: 10, logCount: 4 },
		{ date: "2026-09-18", id: 11, logCount: 3 },
		{ date: "2026-09-19", id: 12, logCount: 4 },
	],
};

export { STREAK_PREVIEW };
