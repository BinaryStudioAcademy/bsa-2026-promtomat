type BedrockErrorDetails = {
	attempts: number | undefined;
	causeMessage: string | undefined;
	causeName: string | undefined;
	httpStatusCode: number | undefined;
	message: string;
	name: string | undefined;
	requestId: string | undefined;
	stack: string | undefined;
};

export { type BedrockErrorDetails };
