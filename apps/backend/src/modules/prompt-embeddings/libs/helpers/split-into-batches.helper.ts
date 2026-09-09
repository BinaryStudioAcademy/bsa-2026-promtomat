const splitIntoBatches = <T>(items: T[], batchSize: number): T[][] => {
	const batches: T[][] = [];

	for (let start = 0; start < items.length; start += batchSize) {
		batches.push(items.slice(start, start + batchSize));
	}

	return batches;
};

export { splitIntoBatches };
