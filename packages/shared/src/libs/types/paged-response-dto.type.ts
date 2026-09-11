type PagedResponseDto<T> = {
	items: T[];
	page: number;
	pageSize: number;
	totalCount: number;
};

export { type PagedResponseDto };
