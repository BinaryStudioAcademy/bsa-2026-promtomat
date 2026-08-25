import { Buffer } from "node:buffer";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import {
	type Hashing,
	type HashResult,
	type HashVerificationOptions,
} from "./libs/types/types.js";

const DERIVED_KEY_LENGTH = 64;
const STRING_ENCODING = "hex";

const scryptAsync = promisify<string, string, number, Buffer>(scrypt);

class BaseHashing implements Hashing {
	private saltLength: number;

	public constructor(saltLength: number) {
		this.saltLength = saltLength;
	}

	private deriveKey(data: string, salt: string): Promise<Buffer> {
		return scryptAsync(data, salt, DERIVED_KEY_LENGTH);
	}

	public async hash(data: string): Promise<HashResult> {
		const salt = randomBytes(this.saltLength).toString(STRING_ENCODING);
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
