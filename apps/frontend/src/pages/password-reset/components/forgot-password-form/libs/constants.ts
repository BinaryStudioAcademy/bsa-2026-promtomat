import { type ForgotPasswordRequestDto } from "~/modules/auth/auth.js";

const DEFAULT_FORGOT_PASSWORD_PAYLOAD: ForgotPasswordRequestDto = {
	email: "",
};

const ForgotPasswordMessage = {
	BACK_TO_SIGN_IN: "Back to sign in",
	DESCRIPTION: "Enter your email and we will send you a reset link.",
	FOOTER_LEAD: "Remembered your password?",
	SENDING: "Sending...",
	SENT_DESCRIPTION:
		"If that address has an account, a reset link is on its way. The link expires in 10 minutes.",
	SENT_TITLE: "Check your email",
	SUBMIT: "Send reset link",
	TITLE: "Reset your password",
} as const;

export { DEFAULT_FORGOT_PASSWORD_PAYLOAD, ForgotPasswordMessage };
