type LogFunction = (
	message: string,
	parameters?: Record<string, unknown>,
) => void;

type Logger = {
	debug: LogFunction;
	error: LogFunction;
	flush: () => void;
	info: LogFunction;
	warn: LogFunction;
};

export { type Logger };
