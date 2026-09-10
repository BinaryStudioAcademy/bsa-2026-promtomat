import { type PrimaryAiCodingTool } from "./primary-ai-coding-tool.type.js";

type UserDto = {
	email: string;
	id: number;
	nickname: string;
	primaryAiCodingTool: null | PrimaryAiCodingTool;
};

export { type UserDto };
