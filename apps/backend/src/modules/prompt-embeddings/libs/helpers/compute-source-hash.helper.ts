import { createHash } from "node:crypto";

import { HASH_ALGORITHM, HASH_ENCODING } from "~/libs/constants/constants.js";

const computeSourceHash = (text: string): string =>
	createHash(HASH_ALGORITHM).update(text).digest(HASH_ENCODING);

export { computeSourceHash };
