import { TextSeparator } from "../enums/enums.js";

const joinBlocks = (blocks: string[][]): string =>
	blocks
		.map((lines) => lines.join(TextSeparator.LINE))
		.join(TextSeparator.BLOCK);

export { joinBlocks };
