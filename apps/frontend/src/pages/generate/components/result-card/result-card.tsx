import React from "react";

import styles from "./styles.module.css";

type SlotProperties = {
	children: React.ReactNode;
};

const ResultCardRoot: React.FC<SlotProperties> = ({
	children,
}: SlotProperties) => <article className={styles["card"]}>{children}</article>;

const Kicker: React.FC<SlotProperties> = ({ children }: SlotProperties) => (
	<span className={styles["kicker"]}>{children}</span>
);

const Actions: React.FC<SlotProperties> = ({ children }: SlotProperties) => (
	<div className={styles["actions"]}>{children}</div>
);

const ResultCard = Object.assign(ResultCardRoot, { Actions, Kicker });

export { ResultCard };
