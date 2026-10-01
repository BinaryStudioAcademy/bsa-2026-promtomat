import { formatDistanceToNowStrict } from "date-fns";

const getRelativeTimeLabel = (isoDate: string): string => {
	return formatDistanceToNowStrict(new Date(isoDate), { addSuffix: true });
};

export { getRelativeTimeLabel };
