import { type SignUpRequestDto } from "~/modules/auth/auth.js";

const DEFAULT_SIGN_UP_PAYLOAD: SignUpRequestDto = {
	email: "",
	nickname: "",
	password: "",
};

export { DEFAULT_SIGN_UP_PAYLOAD };
