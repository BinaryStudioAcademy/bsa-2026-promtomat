const getBrowserTimeZone = (): string => {
	return new Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export { getBrowserTimeZone };
