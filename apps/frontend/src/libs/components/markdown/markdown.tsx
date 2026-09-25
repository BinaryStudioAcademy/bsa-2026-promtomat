import React from "react";
import ReactMarkdown from "react-markdown";

import { MARKDOWN_COMPONENTS } from "./libs/constants/constants.js";

type Properties = {
	content: string;
};

const Markdown: React.FC<Properties> = ({ content }: Properties) => {
	return (
		<ReactMarkdown components={MARKDOWN_COMPONENTS}>{content}</ReactMarkdown>
	);
};

export { Markdown };
