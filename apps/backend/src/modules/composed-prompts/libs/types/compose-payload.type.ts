import { type ComposeRequestDto } from "./types.js";

type ComposePayload = ComposeRequestDto & { userId: number };

export { type ComposePayload };
