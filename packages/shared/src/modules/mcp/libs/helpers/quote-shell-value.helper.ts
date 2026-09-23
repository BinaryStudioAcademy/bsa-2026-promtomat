import { ESCAPED_SHELL_QUOTE, SHELL_QUOTE } from "../constants/constants.js";

const quoteShellValue = (value: string): string => {
	const escapedValue = value.replaceAll(SHELL_QUOTE, () => ESCAPED_SHELL_QUOTE);

	return `${SHELL_QUOTE}${escapedValue}${SHELL_QUOTE}`;
};

export { quoteShellValue };
