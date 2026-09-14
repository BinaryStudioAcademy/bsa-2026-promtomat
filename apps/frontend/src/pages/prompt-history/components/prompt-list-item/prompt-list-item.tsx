import React, { useCallback, useId, useState } from "react";

import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
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
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const { copyToClipboard, isCopied } = useClipboard();

	const contentId = useId();
	const scoreColorClass = styles[getScoreColor(prompt.score)];
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);

	const handleToggle = useCallback((): void => {
		setIsExpanded((previous) => !previous);
	}, []);

	const handleRowClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>): void => {
			const target = event.target as HTMLElement;
			if (target.closest("button, input, textarea")) {
				return;
			}
			handleToggle();
		},
		[handleToggle],
	);

	const handleRowKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>): void => {
			if (event.target !== event.currentTarget) {
				return;
			}
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				handleToggle();
			}
		},
		[handleToggle],
	);

	const handleCopyClick = useCallback((): void => {
		void copyToClipboard(prompt.body);
	}, [copyToClipboard, prompt.body]);

	return (
		<div className={styles["item"]}>
			<div
				aria-controls={contentId}
				aria-expanded={isExpanded}
				className={styles["row"]}
				onClick={handleRowClick}
				onKeyDown={handleRowKeyDown}
				role="button"
				tabIndex={0}
			>
				<div
					className={getValidClasses(styles["score-badge"], scoreColorClass)}
				>
					{prompt.score}
				</div>
				<div className={styles["info"]}>
					<span className={styles["intent"]}>{prompt.intent}</span>
					<span className={styles["meta"]}>
						{prompt.workspaceName || "No workspace"}
					</span>
				</div>
				<div className={styles["right-controls"]}>
					<span className={styles["timestamp"]}>Injected {relativeTime}</span>
					<span
						className={getValidClasses(
							styles["chevron"],
							isExpanded && styles["chevron-expanded"],
						)}
					>
						▾
					</span>
				</div>
			</div>

			{isExpanded && (
				<div className={styles["expanded"]} id={contentId}>
					<div className={styles["expanded-header"]}>
						<span className={styles["expanded-label"]}>Prompt Body</span>
						<button
							className={styles["copy-button"]}
							onClick={handleCopyClick}
							type="button"
						>
							{isCopied ? "Copied!" : "Copy"}
						</button>
					</div>
					<pre className={styles["body"]}>{prompt.body}</pre>
				</div>
			)}
		</div>
	);
};

export { PromptListItem };
