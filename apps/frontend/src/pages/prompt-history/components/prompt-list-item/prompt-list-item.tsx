import React, { useCallback, useId, useState } from "react";

import { getScoreColor } from "~/libs/components/score-grid/libs/helpers/get-score-color.helper.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useClipboard } from "~/libs/hooks/use-clipboard/use-clipboard.hook.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

import styles from "./styles.module.css";

const KeyboardKey = {
	ENTER: "Enter",
	SPACE: " ",
} as const;

const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINIMUM_UNIT = 1;

type Properties = {
	prompt: PromptItemResponseDto;
};

const formatRelativeTime = (isoDate: string): string => {
	const diffMinutes = Math.floor(
		(Date.now() - new Date(isoDate).getTime()) / MS_PER_MINUTE,
	);

	if (diffMinutes < MINIMUM_UNIT) {
		return "just now";
	}

	if (diffMinutes < MINUTES_PER_HOUR) {
		return `${String(diffMinutes)} minute${diffMinutes === MINIMUM_UNIT ? "" : "s"} ago`;
	}

	const diffHours = Math.floor(diffMinutes / MINUTES_PER_HOUR);

	if (diffHours < HOURS_PER_DAY) {
		return `${String(diffHours)} hour${diffHours === MINIMUM_UNIT ? "" : "s"} ago`;
	}

	const diffDays = Math.floor(diffHours / HOURS_PER_DAY);

	return `${String(diffDays)} day${diffDays === MINIMUM_UNIT ? "" : "s"} ago`;
};

const PromptListItem: React.FC<Properties> = ({ prompt }) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const { copyToClipboard, isCopied } = useClipboard();

	const contentId = useId();
	const scoreColorClass = styles[getScoreColor(prompt.score)];
	const relativeTime = formatRelativeTime(prompt.createdAt);

	const handleToggle = useCallback((): void => {
		setIsExpanded((previous) => !previous);
	}, []);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>): void => {
			if (event.key !== KeyboardKey.ENTER && event.key !== KeyboardKey.SPACE) {
				return;
			}

			event.preventDefault();
			handleToggle();
		},
		[handleToggle],
	);

	const handleCopyClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>): void => {
			event.stopPropagation();
			void copyToClipboard(prompt.body);
		},
		[copyToClipboard, prompt.body],
	);

	return (
		<div className={styles["item"]}>
			<div
				aria-controls={contentId}
				aria-expanded={isExpanded}
				className={styles["row"]}
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
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
						{/* {prompt.workspaceName} · Injected {relativeTime} */}
					</span>
				</div>
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
