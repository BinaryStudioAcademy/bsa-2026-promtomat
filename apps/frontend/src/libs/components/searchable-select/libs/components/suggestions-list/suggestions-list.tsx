import { createPortal } from "react-dom";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import { SUGGESTIONS_GAP_PX } from "../../constants/constants.js";
import styles from "./styles.module.css";

type SuggestionsListProperties = {
	activeIndex: number;
	activeSuggestionReference: React.RefObject<HTMLLIElement | null>;
	inputRect: DOMRect;
	onSuggestionMouseDown: (value: string) => (event: React.MouseEvent) => void;
	onSuggestionMouseMove: (index: number) => () => void;
	suggestions: string[];
	suggestionsListId: string;
};

const SuggestionsList = ({
	activeIndex,
	activeSuggestionReference,
	inputRect,
	onSuggestionMouseDown,
	onSuggestionMouseMove,
	suggestions,
	suggestionsListId,
}: SuggestionsListProperties): React.ReactPortal =>
	createPortal(
		<ul
			className={styles["suggestions"]}
			id={suggestionsListId}
			role="listbox"
			style={{
				left: inputRect.left,
				position: "fixed",
				top: inputRect.bottom + SUGGESTIONS_GAP_PX,
				width: inputRect.width,
			}}
		>
			{suggestions.map((value, index) => (
				<li
					aria-selected={index === activeIndex}
					className={getValidClasses(
						styles["suggestion"],
						index === activeIndex && styles["suggestion-active"],
					)}
					id={`${suggestionsListId}-option-${String(index)}`}
					key={value}
					onMouseDown={onSuggestionMouseDown(value)}
					onMouseMove={onSuggestionMouseMove(index)}
					ref={index === activeIndex ? activeSuggestionReference : undefined}
					role="option"
				>
					{value}
				</li>
			))}
		</ul>,
		document.body,
	);

export { SuggestionsList };
