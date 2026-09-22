import { type Components } from "react-markdown";

import { MarkdownElement } from "../components/markdown-element/markdown-element.js";
import { MarkdownLink } from "../components/markdown-link/markdown-link.js";

const MARKDOWN_COMPONENTS: Components = {
	a: MarkdownLink,
	blockquote: MarkdownElement,
	code: MarkdownElement,
	h1: MarkdownElement,
	h2: MarkdownElement,
	h3: MarkdownElement,
	h4: MarkdownElement,
	h5: MarkdownElement,
	h6: MarkdownElement,
	hr: MarkdownElement,
	ol: MarkdownElement,
	p: MarkdownElement,
	pre: MarkdownElement,
	ul: MarkdownElement,
};

export { MARKDOWN_COMPONENTS };
