import { format, isValid, parseISO } from "date-fns";

const formatDate = (date: string, formatPattern: string): string => {
	const parsedDate = parseISO(date);

	return isValid(parsedDate) ? format(parsedDate, formatPattern) : date;
};

export { formatDate };
