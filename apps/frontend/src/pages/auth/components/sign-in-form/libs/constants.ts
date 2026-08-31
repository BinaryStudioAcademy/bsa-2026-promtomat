import { type SignInRequestDto } from "~/modules/auth/auth.js";

const DEFAULT_SIGN_IN_PAYLOAD: SignInRequestDto = {
	email: "",
	password: "",
};

export { DEFAULT_SIGN_IN_PAYLOAD };
