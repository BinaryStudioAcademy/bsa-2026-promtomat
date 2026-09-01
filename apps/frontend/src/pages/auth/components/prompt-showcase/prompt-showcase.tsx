import { PROMPT_SHOWCASE_ITEMS } from "./libs/constants.js";
import styles from "./styles.module.css";

const PromptShowcase: React.FC = () => {
	return (
		<ul className={styles["showcase"]}>
			{PROMPT_SHOWCASE_ITEMS.map(({ prompt, score, tags }) => (
				<li className={styles["card"]} key={prompt}>
					<p className={styles["prompt"]}>&gt; {prompt}</p>

					<div className={styles["pills"]}>
						<span className={styles["score"]}>{score}</span>

						{tags.map((tag) => (
							<span className={styles["tag"]} key={tag}>
								{tag}
							</span>
						))}
					</div>
				</li>
			))}
		</ul>
	);
};

export { PromptShowcase };
