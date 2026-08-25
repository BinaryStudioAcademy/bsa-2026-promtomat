import { type HashedPassword } from "./hashed-password.type.js";
import { type PasswordVerificationOptions } from "./password-verification-options.type.js";

type PasswordHasher = {
	hash: (password: string) => Promise<HashedPassword>;
	verify: (options: PasswordVerificationOptions) => Promise<boolean>;
};

export { type PasswordHasher };
