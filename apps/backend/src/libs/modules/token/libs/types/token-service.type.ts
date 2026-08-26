type TokenService = {
	create<T extends Record<string, unknown>>(payload: T): Promise<string>;
	verify<T extends Record<string, unknown>>(token: string): Promise<T>;
};

export { type TokenService };
