import React from "react";
import { type ExtraProps } from "react-markdown";

type Properties = ExtraProps & React.ComponentProps<"a">;

const PreviewLink: React.FC<Properties> = ({ children, href }: Properties) => {
	return (
		<a href={href} rel="noreferrer" target="_blank">
			{children}
		</a>
	);
};

export { PreviewLink };
