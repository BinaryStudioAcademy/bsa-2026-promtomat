type Token = {
	create<T extends Record<string, unknown>>(payload: T): Promise<string>;
	verify<T>(token: string): Promise<T>;
};

export { type Token };
