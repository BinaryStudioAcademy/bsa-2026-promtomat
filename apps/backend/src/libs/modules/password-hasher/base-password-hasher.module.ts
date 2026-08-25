import { Buffer } from "node:buffer";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

import {
	type HashedPassword,
	type PasswordHasher,
	type PasswordVerificationOptions,
} from "./libs/types/types.js";

const DERIVED_KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const STRING_ENCODING = "hex";

class BasePasswordHasher implements PasswordHasher {
	private deriveKey(password: string, salt: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			scrypt(password, salt, DERIVED_KEY_LENGTH, (error, derivedKey) => {
				if (error) {
					reject(error);

					return;
				}

				resolve(derivedKey);
			});
		});
	}

	public async hash(password: string): Promise<HashedPassword> {
		const salt = randomBytes(SALT_LENGTH).toString(STRING_ENCODING);
		const derivedKey = await this.deriveKey(password, salt);

		return {
			hash: derivedKey.toString(STRING_ENCODING),
			salt,
		};
	}

	public async verify({
		hash,
		password,
		salt,
	}: PasswordVerificationOptions): Promise<boolean> {
		const derivedKey = await this.deriveKey(password, salt);
		const storedHash = Buffer.from(hash, STRING_ENCODING);

		return (
			derivedKey.length === storedHash.length &&
			timingSafeEqual(derivedKey, storedHash)
		);
	}
}

export { BasePasswordHasher };
