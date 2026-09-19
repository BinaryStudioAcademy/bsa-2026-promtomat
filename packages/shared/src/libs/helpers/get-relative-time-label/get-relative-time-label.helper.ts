import { formatDistanceToNow } from "date-fns";

const getRelativeTimeLabel = (isoDate: string): string => {
	return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
};

export { getRelativeTimeLabel };
