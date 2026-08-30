import { type SignUpRequestDto } from "~/modules/auth/auth.js";

const DEFAULT_SIGN_UP_PAYLOAD: SignUpRequestDto = {
	email: "",
	password: "",
};

const SIGN_UP_SUCCESS_MESSAGE =
	"Your account was created successfully. If you are not redirected, please sign in.";

export { DEFAULT_SIGN_UP_PAYLOAD, SIGN_UP_SUCCESS_MESSAGE };
