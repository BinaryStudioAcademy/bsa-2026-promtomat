import { ORDER_BY_RANK_MODIFIER } from "./order-by-rank-modifier.constant.js";
import { PROMPT_RELATION } from "./prompt-relation.constant.js";
import { SOURCES_RELATION } from "./sources-relation.constant.js";

const SOURCES_GRAPH = `${SOURCES_RELATION}(${ORDER_BY_RANK_MODIFIER}).${PROMPT_RELATION}`;

export { SOURCES_GRAPH };
