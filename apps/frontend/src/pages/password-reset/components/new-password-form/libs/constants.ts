import { type NewPasswordFormValues } from "~/modules/auth/auth.js";

const TOKEN_QUERY_PARAMETER = "token";

const DEFAULT_NEW_PASSWORD_PAYLOAD: NewPasswordFormValues = {
	confirmPassword: "",
	password: "",
};

const NewPasswordMessage = {
	DESCRIPTION: "This link is valid for 10 minutes and can be used once.",
	DONE_DESCRIPTION:
		"You have been signed out on your other devices. Sign in again with your new password.",
	DONE_TITLE: "Password updated",
	FOOTER_LEAD: "Link no longer works?",
	GO_TO_SIGN_IN: "Go to sign in",
	LINK_INVALID: "This link is no longer valid. Request a new one.",
	SETTING: "Setting...",
	SUBMIT: "Set new password",
	TITLE: "Choose a new password",
} as const;

export {
	DEFAULT_NEW_PASSWORD_PAYLOAD,
	NewPasswordMessage,
	TOKEN_QUERY_PARAMETER,
};
