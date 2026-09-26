import React from "react";
import { type ExtraProps } from "react-markdown";

import styles from "./styles.module.css";

type Properties = ExtraProps & React.ComponentProps<"a">;

const MarkdownLink: React.FC<Properties> = ({ children, href }: Properties) => {
	return (
		<a className={styles["link"]} href={href} rel="noreferrer" target="_blank">
			{children}
		</a>
	);
};

export { MarkdownLink };
