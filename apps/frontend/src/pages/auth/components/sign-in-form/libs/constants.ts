import { type FieldPath } from "react-hook-form";

import { type SignInRequestDto } from "~/modules/auth/auth.js";

const DEFAULT_SIGN_IN_PAYLOAD: SignInRequestDto = {
	email: "",
	password: "",
};

const SIGN_IN_FIELDS: FieldPath<SignInRequestDto>[] = ["email", "password"];

export { DEFAULT_SIGN_IN_PAYLOAD, SIGN_IN_FIELDS };
