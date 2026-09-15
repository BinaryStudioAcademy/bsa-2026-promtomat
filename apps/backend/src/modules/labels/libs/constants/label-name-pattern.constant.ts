import { LABEL_MAX_LENGTH } from "./label-max-length.constant.js";

const LABEL_NAME_PATTERN = new RegExp(
	`^[a-z0-9]{1,${LABEL_MAX_LENGTH.toString()}}$`,
);

export { LABEL_NAME_PATTERN };
