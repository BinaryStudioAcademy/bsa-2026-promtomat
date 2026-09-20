const formatDate = (date: string, options?: Intl.DateTimeFormatOptions) => {
	return new Date(date).toLocaleDateString(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
		...options,
	});
};

export { formatDate };
