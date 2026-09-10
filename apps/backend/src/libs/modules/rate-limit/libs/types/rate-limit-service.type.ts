type RateLimitService = {
	consume(key: string): boolean;
};

export { type RateLimitService };
