import { type StopReason } from "@aws-sdk/client-bedrock-runtime";

const isGenerationCompleted = (stopReason: StopReason | undefined): boolean => {
	if (stopReason === undefined) {
		return true;
	}

	return stopReason === "end_turn" || stopReason === "stop_sequence";
};

export { isGenerationCompleted };
