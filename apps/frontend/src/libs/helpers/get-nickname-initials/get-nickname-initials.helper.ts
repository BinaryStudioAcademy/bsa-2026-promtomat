import {
	FIRST_ELEMENT_INDEX,
	NICKNAME_INITIALS_LENGTH,
} from "~/libs/constants/constants.js";

const getNicknameInitials = (nickname: string): string => {
	return nickname.slice(FIRST_ELEMENT_INDEX, NICKNAME_INITIALS_LENGTH);
};

export { getNicknameInitials };
