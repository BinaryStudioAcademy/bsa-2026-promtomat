import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { Icon } from "~/libs/components/icon/icon.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import {
	EMPTY_SELECTION_LENGTH,
	FIRST_ELEMENT_INDEX,
	SUGGESTIONS_GAP_PX,
} from "./libs/constants/constants.js";
import { useSuggestions, useTags } from "./libs/hooks/hooks.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	isDisabled?: boolean;
	label: string;
	name: FieldPath<T>;
	placeholder?: string;
	size?: ValueOf<typeof ControlSize>;
};

const TechStackTagsInput = <T extends FieldValues>({
	control,
	isDisabled = false,
	label,
	name,
	placeholder = "Type to search...",
	size = ControlSize.MD,
}: Properties<T>): React.JSX.Element => {
	const {
		field: { onBlur, onChange, value: fieldValue },
		fieldState: { error },
	} = useController({ control, disabled: isDisabled, name });

	const selectedTags = fieldValue as string[];
	const errorMessage = error?.message;
	const hasError = Boolean(error);

	const errorMessageId = useId();
	const inputId = useId();
	const suggestionsListId = useId();

	const inputReference = useRef<HTMLInputElement>(null);
	const activeSuggestionReference = useRef<HTMLLIElement>(null);
	const [inputRect, setInputRect] = useState<DOMRect | null>(null);

	const [inputValue, setInputValue] = useState("");
	const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

	const { addTag, removeLastTag, removeTag } = useTags({
		onChange,
		selectedTags,
	});

	const {
		activeIndex,
		getActiveSuggestion,
		hasSuggestions,
		resetActiveIndex,
		selectNext,
		selectPrevious,
		setActiveIndexDirectly,
		suggestions,
	} = useSuggestions({
		inputValue,
		isOpen: isSuggestionsOpen,
		selectedTags,
	});

	useLayoutEffect(() => {
		if (isSuggestionsOpen && inputReference.current) {
			setInputRect(inputReference.current.getBoundingClientRect());
		}
	}, [isSuggestionsOpen, suggestions]);

	useEffect(() => {
		activeSuggestionReference.current?.scrollIntoView({ block: "nearest" });
	}, [activeIndex]);

	const commitTag = useCallback(
		(tag: string) => {
			addTag(tag);
			setInputValue("");
			resetActiveIndex();
			inputReference.current?.focus();
		},
		[addTag, resetActiveIndex],
	);

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(event.target.value);
			resetActiveIndex();
		},
		[resetActiveIndex],
	);

	const handleInputFocus = useCallback(() => {
		setIsSuggestionsOpen(true);
	}, []);

	const handleInputBlur = useCallback(() => {
		onBlur();
		setIsSuggestionsOpen(false);
		resetActiveIndex();
	}, [onBlur, resetActiveIndex]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (hasSuggestions && event.key === "ArrowDown") {
				event.preventDefault();
				selectNext();
				return;
			}

			if (hasSuggestions && event.key === "ArrowUp") {
				event.preventDefault();
				selectPrevious();
				return;
			}

			if (event.key === "Enter") {
				event.preventDefault();

				const tagToAdd = getActiveSuggestion();

				if (tagToAdd) {
					commitTag(tagToAdd);
				}

				return;
			}

			if (inputValue === "" && event.key === "Backspace") {
				removeLastTag();
			}
		},
		[
			hasSuggestions,
			selectNext,
			selectPrevious,
			getActiveSuggestion,
			commitTag,
			inputValue,
			removeLastTag,
		],
	);

	const handleRemoveTagClick = useCallback(
		(tag: string) => () => {
			removeTag(tag);
		},
		[removeTag],
	);

	const handleSuggestionMouseDown = useCallback(
		(tag: string) => (event: React.MouseEvent) => {
			event.preventDefault();
			commitTag(tag);
		},
		[commitTag],
	);

	const handleSuggestionMouseMove = useCallback(
		(index: number) => () => {
			setActiveIndexDirectly(index);
		},
		[setActiveIndexDirectly],
	);

	return (
		<div className={styles["field"]}>
			<label className={styles["label"]} htmlFor={inputId}>
				{label}
			</label>

			<div
				className={getValidClasses(
					styles["control"],
					styles[size],
					hasError && styles["error"],
				)}
			>
				<ul className={styles["tags"]}>
					{selectedTags.map((tag) => (
						<li className={styles["tag"]} key={tag}>
							<span className={styles["tag-text"]}>{tag}</span>
							<button
								aria-label={`Remove ${tag}`}
								className={styles["remove"]}
								disabled={isDisabled}
								onClick={handleRemoveTagClick(tag)}
								type="button"
							>
								<Icon
									className={styles["remove-icon"]}
									iconName={IconName.CLOSE}
								/>
							</button>
						</li>
					))}
				</ul>

				<input
					aria-activedescendant={
						activeIndex >= FIRST_ELEMENT_INDEX
							? `${suggestionsListId}-option-${String(activeIndex)}`
							: undefined
					}
					aria-autocomplete="list"
					aria-controls={suggestionsListId}
					aria-describedby={
						errorMessage === undefined ? undefined : errorMessageId
					}
					aria-expanded={suggestions.length > FIRST_ELEMENT_INDEX}
					aria-invalid={hasError || undefined}
					className={styles["input"]}
					disabled={isDisabled}
					id={inputId}
					onBlur={handleInputBlur}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					onKeyDown={handleKeyDown}
					placeholder={
						selectedTags.length === EMPTY_SELECTION_LENGTH ? placeholder : ""
					}
					ref={inputReference}
					role="combobox"
					value={inputValue}
				/>
			</div>

			{suggestions.length > FIRST_ELEMENT_INDEX &&
				inputRect &&
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
						{suggestions.map((tag, index) => (
							<li
								aria-selected={index === activeIndex}
								className={getValidClasses(
									styles["suggestion"],
									index === activeIndex && styles["suggestion-active"],
								)}
								id={`${suggestionsListId}-option-${String(index)}`}
								key={tag}
								onMouseDown={handleSuggestionMouseDown(tag)}
								onMouseMove={handleSuggestionMouseMove(index)}
								ref={
									index === activeIndex ? activeSuggestionReference : undefined
								}
								role="option"
							>
								{tag}
							</li>
						))}
					</ul>,
					document.body,
				)}

			<span className={styles["message"]} id={errorMessageId}>
				{errorMessage}
			</span>
		</div>
	);
};

export { TechStackTagsInput };
