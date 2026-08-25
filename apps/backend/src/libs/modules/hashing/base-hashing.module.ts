import { Buffer } from "node:buffer";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

import {
	type Hashing,
	type HashResult,
	type HashVerificationOptions,
} from "./libs/types/types.js";

const DERIVED_KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const STRING_ENCODING = "hex";

class BaseHashing implements Hashing {
	private deriveKey(data: string, salt: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			scrypt(data, salt, DERIVED_KEY_LENGTH, (error, derivedKey) => {
				if (error) {
					reject(error);

					return;
				}

				resolve(derivedKey);
			});
		});
	}

	public async hash(data: string): Promise<HashResult> {
		const salt = randomBytes(SALT_LENGTH).toString(STRING_ENCODING);
		const derivedKey = await this.deriveKey(data, salt);

		return {
			hash: derivedKey.toString(STRING_ENCODING),
			salt,
		};
	}

	public async verify({
		data,
		hash,
		salt,
	}: HashVerificationOptions): Promise<boolean> {
		const derivedKey = await this.deriveKey(data, salt);
		const storedHash = Buffer.from(hash, STRING_ENCODING);

		return (
			derivedKey.length === storedHash.length &&
			timingSafeEqual(derivedKey, storedHash)
		);
	}
}

export { BaseHashing };
