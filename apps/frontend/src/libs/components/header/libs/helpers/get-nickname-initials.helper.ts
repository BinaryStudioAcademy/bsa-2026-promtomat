import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";

import { NICKNAME_INITIALS_LENGTH } from "../constants/constants.js";

const getNicknameInitials = (nickname: string): string => {
	return nickname.slice(FIRST_ELEMENT_INDEX, NICKNAME_INITIALS_LENGTH);
};

export { getNicknameInitials };
