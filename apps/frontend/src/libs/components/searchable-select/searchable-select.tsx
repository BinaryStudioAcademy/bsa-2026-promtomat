import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	type Control,
	type FieldPathByValue,
	type FieldValues,
	useController,
} from "react-hook-form";

import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";
import { ControlSize, KeyboardKey } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { SelectedValue } from "./libs/components/selected-value/selected-value.js";
import { SuggestionsList } from "./libs/components/suggestions-list/suggestions-list.js";
import { EMPTY_SELECTION_LENGTH } from "./libs/constants/constants.js";
import { useSelectedValues, useSuggestions } from "./libs/hooks/hooks.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	control: Control<T, null>;
	isDisabled?: boolean;
	label: string;
	name: FieldPathByValue<T, string[]>;
	placeholder: string;
	size?: ValueOf<typeof ControlSize>;
	valuesDictionary: string[];
};

const SearchableSelect = <T extends FieldValues>({
	control,
	isDisabled = false,
	label,
	name,
	placeholder,
	size = ControlSize.MD,
	valuesDictionary,
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
	const controlReference = useRef<HTMLDivElement>(null);
	const activeSuggestionReference = useRef<HTMLLIElement>(null);
	const [controlRect, setControlRect] = useState<DOMRect | null>(null);

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
		inputValue,
		isOpen: isSuggestionsOpen,
		selectedValues,
		valuesDictionary,
	});

	const updateControlRect = useCallback((): void => {
		const controlElement = controlReference.current;

		if (controlElement === null) {
			return;
		}

		setControlRect(controlElement.getBoundingClientRect());
	}, []);

	useLayoutEffect(() => {
		if (!isSuggestionsOpen) {
			return;
		}

		updateControlRect();
	}, [isSuggestionsOpen, suggestions, updateControlRect]);

	useEffect(() => {
		if (!isSuggestionsOpen) {
			return;
		}

		window.addEventListener("resize", updateControlRect);

		return () => {
			window.removeEventListener("resize", updateControlRect);
		};
	}, [isSuggestionsOpen, updateControlRect]);

	useEffect(() => {
		activeSuggestionReference.current?.scrollIntoView({
			block: "nearest",
			inline: "nearest",
		});
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
				ref={controlReference}
			>
				<ul className={styles["values"]}>
					{selectedValues.map((value) => (
						<SelectedValue
							isDisabled={isDisabled}
							key={value}
							onRemove={handleRemoveValueClick}
							value={value}
						/>
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
					aria-expanded={hasSuggestions}
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

			{hasSuggestions && controlRect && (
				<SuggestionsList
					activeIndex={activeIndex}
					activeSuggestionReference={activeSuggestionReference}
					controlRect={controlRect}
					onSuggestionMouseDown={handleSuggestionMouseDown}
					onSuggestionMouseMove={handleSuggestionMouseMove}
					suggestions={suggestions}
					suggestionsListId={suggestionsListId}
				/>
			)}

			<span className={styles["message"]} id={errorMessageId}>
				{errorMessage}
			</span>
		</div>
	);
};

export { SearchableSelect };
