import { type PromptStreakDayDto } from "./prompt-streak-day-dto.type.js";

type PromptStreakResponseDto = {
	currentStreak: number;
	days: PromptStreakDayDto[];
};

export { type PromptStreakResponseDto };
