import { createHash } from "node:crypto";

import { DESCRIPTION_HASH_ALGORITHM } from "../constants/constants.js";
import { normalizeDescription } from "./normalize-description.helper.js";

const computeDescriptionHash = (description: string): string =>
	createHash(DESCRIPTION_HASH_ALGORITHM)
		.update(normalizeDescription(description))
		.digest("hex");

export { computeDescriptionHash };
