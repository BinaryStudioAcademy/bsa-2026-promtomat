import { KeyboardKey } from "~/libs/enums/enums.js";

const preventLineBreak = (event: React.KeyboardEvent): void => {
	if (event.key === KeyboardKey.ENTER) {
		event.preventDefault();
	}
};

export { preventLineBreak };
