import { useCallback, useId, useMemo, useRef, useState } from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	useController,
} from "react-hook-form";

import { Icon } from "~/libs/components/icon/icon.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import {
	getTechStackTagSuggestions,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { FIRST_ELEMENT_INDEX } from "../workspace-create-form/libs/constants/constants.js";
import styles from "./styles.module.css";

const NO_ACTIVE_SUGGESTION = -1;
const EMPTY_SELECTION_LENGTH = 0;
const INDEX_STEP = 1;

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

	const errorMessageId = useId();
	const inputId = useId();
	const suggestionsListId = useId();
	const [inputValue, setInputValue] = useState("");
	const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
	const [activeSuggestionIndex, setActiveSuggestionIndex] =
		useState(NO_ACTIVE_SUGGESTION);
	const inputReference = useRef<HTMLInputElement>(null);

	const hasError = Boolean(error);
	const errorMessage = error?.message;

	const suggestions = useMemo(() => {
		if (!isSuggestionsOpen) {
			return [];
		}

		return getTechStackTagSuggestions(inputValue).filter(
			(tag) => !selectedTags.includes(tag),
		);
	}, [inputValue, isSuggestionsOpen, selectedTags]);

	const addTag = useCallback(
		(tag: string) => {
			onChange([...selectedTags, tag]);
			setInputValue("");
			setActiveSuggestionIndex(NO_ACTIVE_SUGGESTION);
			inputReference.current?.focus();
		},
		[onChange, selectedTags],
	);

	const removeTag = useCallback(
		(tag: string) => {
			onChange(selectedTags.filter((selectedTag) => selectedTag !== tag));
			inputReference.current?.focus();
		},
		[onChange, selectedTags],
	);

	const removeLastTag = useCallback(() => {
		if (selectedTags.length <= EMPTY_SELECTION_LENGTH) {
			return;
		}

		const lastTag = selectedTags.at(NO_ACTIVE_SUGGESTION);

		if (lastTag) {
			removeTag(lastTag);
		}
	}, [removeTag, selectedTags]);

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(event.target.value);
			setActiveSuggestionIndex(NO_ACTIVE_SUGGESTION);
		},
		[],
	);

	const handleInputFocus = useCallback(() => {
		setIsSuggestionsOpen(true);
	}, []);

	const handleInputBlur = useCallback(() => {
		onBlur();
		setIsSuggestionsOpen(false);
		setActiveSuggestionIndex(NO_ACTIVE_SUGGESTION);
	}, [onBlur]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setActiveSuggestionIndex((previousIndex) =>
					previousIndex + INDEX_STEP < suggestions.length
						? previousIndex + INDEX_STEP
						: FIRST_ELEMENT_INDEX,
				);

				return;
			}

			if (event.key === "ArrowUp") {
				event.preventDefault();
				setActiveSuggestionIndex(
					(previousIndex) =>
						(previousIndex - INDEX_STEP + suggestions.length) %
						suggestions.length,
				);

				return;
			}

			if (event.key === "Enter") {
				event.preventDefault();

				const tagToAdd =
					suggestions[
						activeSuggestionIndex === NO_ACTIVE_SUGGESTION
							? FIRST_ELEMENT_INDEX
							: activeSuggestionIndex
					];

				if (tagToAdd) {
					addTag(tagToAdd);
				}

				return;
			}

			if (inputValue === "" && event.key === "Backspace") {
				removeLastTag();
			}
		},
		[activeSuggestionIndex, addTag, inputValue, removeLastTag, suggestions],
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
			addTag(tag);
		},
		[addTag],
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
							{tag}
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

			{suggestions.length > FIRST_ELEMENT_INDEX && (
				<ul
					className={styles["suggestions"]}
					id={suggestionsListId}
					role="listbox"
				>
					{suggestions.map((tag, index) => (
						<li
							aria-selected={index === activeSuggestionIndex}
							className={getValidClasses(
								styles["suggestion"],
								index === activeSuggestionIndex && styles["suggestion-active"],
							)}
							key={tag}
							onMouseDown={handleSuggestionMouseDown(tag)}
							role="option"
						>
							{tag}
						</li>
					))}
				</ul>
			)}

			<span className={styles["message"]} id={errorMessageId}>
				{errorMessage}
			</span>
		</div>
	);
};

export { TechStackTagsInput };
