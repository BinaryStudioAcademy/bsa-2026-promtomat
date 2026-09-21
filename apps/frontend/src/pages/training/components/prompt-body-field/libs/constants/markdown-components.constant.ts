import { type Components } from "react-markdown";

import { PreviewLink } from "../components/preview-link/preview-link.js";

const MARKDOWN_COMPONENTS: Components = {
	a: PreviewLink,
};

export { MARKDOWN_COMPONENTS };
