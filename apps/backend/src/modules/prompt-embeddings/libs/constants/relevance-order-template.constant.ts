import { SortOrder } from "~/libs/enums/enums.js";

const RELEVANCE_ORDER_TEMPLATE = `(? * (? - (?? <=> ?::vector) / ?) + ? * (COALESCE(??, ??, ?)::numeric / ?)) ${SortOrder.DESC}`;

export { RELEVANCE_ORDER_TEMPLATE };
