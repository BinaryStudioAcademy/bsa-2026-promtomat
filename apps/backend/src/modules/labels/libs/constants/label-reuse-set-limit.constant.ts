// The labels offered back to the model for reuse. Bounded so the generation
// message does not grow with the corpus: the most-used labels are the ones
// worth offering, and a long candidate list degrades the model's choice
// before it ever reaches a token limit.
const LABEL_REUSE_SET_LIMIT = 20;

export { LABEL_REUSE_SET_LIMIT };
