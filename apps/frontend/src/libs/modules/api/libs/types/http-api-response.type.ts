type HTTPApiResponse = Response & {
	json<T = unknown>(): never | Promise<T>;
};

export { type HTTPApiResponse };
