import React from "react";

import styles from "./styles.module.css";

type Properties = {
	cardReference?: React.RefObject<HTMLDivElement | null>;
	children: React.ReactNode;
	tabIndex?: number;
};

const PromptDeliveryCard: React.FC<Properties> = ({
	cardReference,
	children,
	tabIndex,
}: Properties) => (
	<div className={styles["card"]} ref={cardReference} tabIndex={tabIndex}>
		{children}
	</div>
);

export { PromptDeliveryCard };
