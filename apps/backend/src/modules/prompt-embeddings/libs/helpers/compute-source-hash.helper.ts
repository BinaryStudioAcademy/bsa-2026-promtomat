import { createHash } from "node:crypto";

import { SOURCE_HASH_ALGORITHM } from "../constants/constants.js";

const computeSourceHash = (text: string): string =>
	createHash(SOURCE_HASH_ALGORITHM).update(text).digest("hex");

export { computeSourceHash };
