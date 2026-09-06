import { type StopReason } from "@aws-sdk/client-bedrock-runtime";

const TRUNCATED_STOP_REASONS: StopReason[] = [
	"malformed_model_output",
	"max_tokens",
	"model_context_window_exceeded",
];

export { TRUNCATED_STOP_REASONS };
