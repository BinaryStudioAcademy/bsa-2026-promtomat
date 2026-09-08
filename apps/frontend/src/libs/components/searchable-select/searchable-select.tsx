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
	type FieldPathByValue,
	type FieldValues,
	useController,
} from "react-hook-form";

import { ControlSize, IconName, KeyboardKey } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { Icon } from "../icon/icon.js";
import {
	EMPTY_SELECTION_LENGTH,
	FIRST_ELEMENT_INDEX,
	SUGGESTIONS_GAP_PX,
} from "./libs/constants/constants.js";
import { useSelectedValues, useSuggestions } from "./libs/hooks/hooks.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	getSuggestions: (inpurValue: string) => string[];
	isDisabled?: boolean;
	label: string;
	name: FieldPathByValue<T, string[]>;
	placeholder: string;
	size?: ValueOf<typeof ControlSize>;
};

const SearchableSelect = <T extends FieldValues>({
	control,
	getSuggestions,
	isDisabled = false,
	label,
	name,
	placeholder,
	size = ControlSize.MD,
}: Properties<T>): React.JSX.Element => {
	const {
		field: { onBlur, onChange, value: fieldValue },
		fieldState: { error },
	} = useController({ control, disabled: isDisabled, name });

	const selectedValues = fieldValue as string[];
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

	const { addValue, removeLastValue, removeValue } = useSelectedValues({
		onChange,
		selectedValues,
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
		getSuggestions,
		inputValue,
		isOpen: isSuggestionsOpen,
		selectedValues,
	});

	useLayoutEffect(() => {
		if (isSuggestionsOpen && inputReference.current) {
			setInputRect(inputReference.current.getBoundingClientRect());
		}
	}, [isSuggestionsOpen, suggestions]);

	useEffect(() => {
		activeSuggestionReference.current?.scrollIntoView({ block: "nearest" });
	}, [activeIndex]);

	const commitValue = useCallback(
		(value: string) => {
			addValue(value);
			setInputValue("");
			resetActiveIndex();
			inputReference.current?.focus();
		},
		[addValue, resetActiveIndex],
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
			if (hasSuggestions && event.key === KeyboardKey.ARROW_DOWN) {
				event.preventDefault();
				selectNext();
				return;
			}

			if (hasSuggestions && event.key === KeyboardKey.ARROW_UP) {
				event.preventDefault();
				selectPrevious();
				return;
			}

			if (event.key === KeyboardKey.ENTER) {
				event.preventDefault();

				const valueToAdd = getActiveSuggestion();

				if (valueToAdd) {
					commitValue(valueToAdd);
				}

				return;
			}

			if (inputValue === "" && event.key === KeyboardKey.BACKSPACE) {
				removeLastValue();
			}
		},
		[
			hasSuggestions,
			selectNext,
			selectPrevious,
			getActiveSuggestion,
			commitValue,
			inputValue,
			removeLastValue,
		],
	);

	const handleRemoveValueClick = useCallback(
		(value: string) => () => {
			removeValue(value);
		},
		[removeValue],
	);

	const handleSuggestionMouseDown = useCallback(
		(value: string) => (event: React.MouseEvent) => {
			event.preventDefault();
			commitValue(value);
		},
		[commitValue],
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
				<ul className={styles["values"]}>
					{selectedValues.map((value) => (
						<li className={styles["value"]} key={value}>
							<span className={styles["value-text"]}>{value}</span>
							<button
								aria-label={`Remove ${value}`}
								className={styles["remove"]}
								disabled={isDisabled}
								onClick={handleRemoveValueClick(value)}
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
						selectedValues.length === EMPTY_SELECTION_LENGTH ? placeholder : ""
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
						{suggestions.map((value, index) => (
							<li
								aria-selected={index === activeIndex}
								className={getValidClasses(
									styles["suggestion"],
									index === activeIndex && styles["suggestion-active"],
								)}
								id={`${suggestionsListId}-option-${String(index)}`}
								key={value}
								onMouseDown={handleSuggestionMouseDown(value)}
								onMouseMove={handleSuggestionMouseMove(index)}
								ref={
									index === activeIndex ? activeSuggestionReference : undefined
								}
								role="option"
							>
								{value}
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

export { SearchableSelect };
