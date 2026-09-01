import { type ValueOf } from "../../../../libs/types/types.js";
import { AiCodingTool } from "../enums/enums.js";

type UserDto = {
	email: string;
	id: number;
	nickname: string;
	primaryAiCodingTool: ValueOf<typeof AiCodingTool>;
};

export { type UserDto };
