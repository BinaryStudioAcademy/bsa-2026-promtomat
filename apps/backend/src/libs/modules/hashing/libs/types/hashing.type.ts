import { type HashResult } from "./hash-result.type.js";
import { type HashVerificationOptions } from "./hash-verification-options.type.js";

type Hashing = {
	hash: (data: string) => Promise<HashResult>;
	verify: (options: HashVerificationOptions) => Promise<boolean>;
};

export { type Hashing };
