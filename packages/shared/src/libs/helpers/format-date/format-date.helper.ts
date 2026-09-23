import { format, isValid } from "date-fns";

const formatDate = (date: string, formatPattern: string): string => {
	const parsedDate = new Date(date);

	return isValid(parsedDate) ? format(parsedDate, formatPattern) : date;
};

export { formatDate };
