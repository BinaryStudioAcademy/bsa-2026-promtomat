type UseSuggestionsProperties = {
	getSuggestions: (inputValue: string) => string[];
	inputValue: string;
	isOpen: boolean;
	selectedValues: string[];
};

export { UseSuggestionsProperties };
