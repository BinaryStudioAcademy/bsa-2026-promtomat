import React, { createElement } from "react";
import { type ExtraProps } from "react-markdown";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import {
	MARKDOWN_BLOCK_TAGS,
	MARKDOWN_FALLBACK_TAG,
} from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	children?: React.ReactNode;
	className?: string | undefined;
	node?: ExtraProps["node"];
	start?: number | undefined;
};

const MarkdownElement: React.FC<Properties> = ({
	children,
	className,
	node,
	start,
}: Properties) => {
	const tagName = node?.tagName ?? MARKDOWN_FALLBACK_TAG;

	return createElement(
		tagName,
		{
			className: getValidClasses(
				MARKDOWN_BLOCK_TAGS.has(tagName) && styles["block"],
				styles[tagName],
				className,
			),
			start,
		},
		children,
	);
};

export { MarkdownElement };
