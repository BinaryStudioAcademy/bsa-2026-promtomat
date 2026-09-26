import { type PrimaryAiCodingTool } from "./primary-ai-coding-tool.type.js";

type UserProfileSummaryResponseDto = {
	averageScore: null | number;
	currentStreak: number;
	id: number;
	memberSince: string;
	nickname: string;
	primaryAiCodingTool: null | PrimaryAiCodingTool;
	totalPrompts: number;
};

export { type UserProfileSummaryResponseDto };
