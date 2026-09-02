import React from "react";

import { RecordPromptForm } from "./components/record-prompt-form/record-prompt-form.js";
import styles from "./styles.module.css";

const Training: React.FC = () => {
	return (
		<main className={styles["container"]}>
			<div className={styles["card"]}>
				<RecordPromptForm />
			</div>
		</main>
	);
};

export { Training };
