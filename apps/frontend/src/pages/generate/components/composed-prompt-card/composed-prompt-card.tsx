import React from "react";

import { type ComposedPromptDto } from "~/modules/composed-prompts/composed-prompts.js";

import { GenerateLabel } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

type Properties = {
	composedPrompt: ComposedPromptDto;
};

const ComposedPromptCard: React.FC<Properties> = ({
	composedPrompt,
}: Properties) => (
	<article className={styles["card"]}>
		<span className={styles["kicker"]}>{GenerateLabel.COMPOSED_KICKER}</span>
		<pre className={styles["body"]}>{composedPrompt.body}</pre>
		<section className={styles["section"]}>
			<h2 className={styles["heading"]}>{GenerateLabel.EXPLANATION_HEADING}</h2>
			<p className={styles["text"]}>{composedPrompt.explanation}</p>
		</section>
		<section className={styles["section"]}>
			<h2 className={styles["heading"]}>{GenerateLabel.SOURCES_HEADING}</h2>
			<ol className={styles["sources"]}>
				{composedPrompt.sources.map((source) => (
					<li key={source.promptId} value={source.rank}>
						{source.taskIntent}
					</li>
				))}
			</ol>
		</section>
	</article>
);

export { ComposedPromptCard };
