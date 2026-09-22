import React from "react";

import styles from "./styles.module.css";

type Properties = {
	cardReference?: React.RefObject<HTMLDivElement | null>;
	children: React.ReactNode;
	tabIndex?: number;
};

type SlotProperties = {
	children: React.ReactNode;
};

const PromptDeliveryCardRoot: React.FC<Properties> = ({
	cardReference,
	children,
	tabIndex,
}: Properties) => (
	<div className={styles["card"]} ref={cardReference} tabIndex={tabIndex}>
		{children}
	</div>
);

const Header: React.FC<SlotProperties> = ({ children }: SlotProperties) => (
	<div className={styles["header"]}>{children}</div>
);

const Title: React.FC<SlotProperties> = ({ children }: SlotProperties) => (
	<h2 className={styles["title"]}>{children}</h2>
);

const Body: React.FC<SlotProperties> = ({ children }: SlotProperties) => (
	<div className={styles["body"]}>{children}</div>
);

const PromptDeliveryCard = Object.assign(PromptDeliveryCardRoot, {
	Body,
	Header,
	Title,
});

export { PromptDeliveryCard };
