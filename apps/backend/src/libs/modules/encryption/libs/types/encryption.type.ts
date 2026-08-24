import { type EncryptionResult } from "./encryption-result.type.js";

type Encryption = {
	compare: (options: EncryptionCompareOptions) => Promise<boolean>;
	encrypt: (data: string) => Promise<EncryptionResult>;
};

type EncryptionCompareOptions = {
	data: string;
	hash: string;
	salt: string;
};

export { type Encryption, type EncryptionCompareOptions };
