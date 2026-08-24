import { Buffer } from "node:buffer";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

import {
	type Encryption,
	type EncryptionCompareOptions,
	type EncryptionResult,
} from "./libs/types/types.js";

const DERIVED_KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const STRING_ENCODING = "hex";

class BaseEncryption implements Encryption {
	private hashData(data: string, salt: string): Promise<Buffer> {
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

	public async compare({
		data,
		hash,
		salt,
	}: EncryptionCompareOptions): Promise<boolean> {
		const dataHash = await this.hashData(data, salt);
		const storedHash = Buffer.from(hash, STRING_ENCODING);

		return (
			dataHash.length === storedHash.length &&
			timingSafeEqual(dataHash, storedHash)
		);
	}

	public async encrypt(data: string): Promise<EncryptionResult> {
		const salt = randomBytes(SALT_LENGTH).toString(STRING_ENCODING);
		const dataHash = await this.hashData(data, salt);

		return {
			hash: dataHash.toString(STRING_ENCODING),
			salt,
		};
	}
}

export { BaseEncryption };
