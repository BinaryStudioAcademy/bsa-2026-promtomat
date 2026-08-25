import { BasePasswordHasher } from "./base-password-hasher.module.js";

const passwordHasher = new BasePasswordHasher();

export { passwordHasher };
export { type PasswordHasher } from "./libs/types/types.js";
