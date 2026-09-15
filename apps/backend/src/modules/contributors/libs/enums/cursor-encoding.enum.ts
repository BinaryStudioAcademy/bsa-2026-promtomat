import { type Buffer } from "node:buffer";

const CursorEncoding = {
	BASE64_URL: "base64url",
} as const satisfies Record<
	string,
	NonNullable<Parameters<Buffer["toString"]>[number]>
>;

export { CursorEncoding };
