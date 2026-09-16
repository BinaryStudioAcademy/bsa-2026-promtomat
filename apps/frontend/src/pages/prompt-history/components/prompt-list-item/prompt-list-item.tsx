import React, { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import {
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { useClipboard } from "~/libs/hooks/use-clipboard/use-clipboard.hook.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	prompt: PromptItemResponseDto;
};

const PromptListItem: React.FC<Properties> = ({ prompt }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { copyToClipboard, isCopied } = useClipboard();

	const scoreColorClass = styles[getScoreColor(prompt.score)];
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);

	const handleToggle = useCallback(
		(event: React.SyntheticEvent<HTMLDetailsElement>): void => {
			setIsOpen(event.currentTarget.open);
		},
		[],
	);

	const handleCopyClick = useCallback((): void => {
		void copyToClipboard(prompt.body);
	}, [copyToClipboard, prompt.body]);

	return (
		<details className={styles["item"]} onToggle={handleToggle} open={isOpen}>
			<summary className={styles["row"]}>
				<div
					className={getValidClasses(styles["score-badge"], scoreColorClass)}
				>
					{prompt.score}
				</div>
				<div className={styles["info"]}>
					<span className={styles["intent"]}>{prompt.intent}</span>
					<span className={styles["meta"]}>{prompt.workspaceName}</span>
				</div>
				<div className={styles["right-controls"]}>
					<span className={styles["timestamp"]}>Injected {relativeTime}</span>
					<span
						className={getValidClasses(
							styles["chevron"],
							isOpen && styles["chevron-expanded"],
						)}
					>
						▾
					</span>
				</div>
			</summary>

			<div className={styles["expanded"]}>
				<div className={styles["expanded-header"]}>
					<span className={styles["expanded-label"]}>Prompt Body</span>
					<Button
						className={styles["copy-button"]}
						label={isCopied ? "Copied!" : "Copy"}
						onClick={handleCopyClick}
						size={ControlSize.SM}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
				</div>
				<pre className={styles["body"]}>{prompt.body}</pre>
			</div>
		</details>
	);
};

export { PromptListItem };
