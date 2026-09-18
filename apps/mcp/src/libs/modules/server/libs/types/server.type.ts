type Server = {
	start(): Promise<void>;
	stop(): Promise<void>;
};

export { type Server };
