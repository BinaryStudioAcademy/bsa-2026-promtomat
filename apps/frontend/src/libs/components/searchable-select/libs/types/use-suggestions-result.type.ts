type UseSuggestionsResult = {
	activeIndex: number;
	getActiveSuggestion: () => string | undefined;
	hasSuggestions: boolean;
	resetActiveIndex: () => void;
	selectNext: () => void;
	selectPrevious: () => void;
	setActiveIndexDirectly: (index: number) => void;
	suggestions: string[];
};

export { UseSuggestionsResult };
