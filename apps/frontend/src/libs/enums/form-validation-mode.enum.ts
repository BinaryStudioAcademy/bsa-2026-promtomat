import { type ValidationMode } from "react-hook-form";

const FormValidationMode = {
	ALL: "all",
	ON_BLUR: "onBlur",
	ON_CHANGE: "onChange",
	ON_SUBMIT: "onSubmit",
	ON_TOUCHED: "onTouched",
} as const satisfies Record<string, keyof ValidationMode>;

export { FormValidationMode };
