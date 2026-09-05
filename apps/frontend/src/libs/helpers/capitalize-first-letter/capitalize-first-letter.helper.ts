const capitalizeFirstLetter = (text: string): string => {
	if (!text) {
		return text;
	}

	const FIRST_LETTER_INDEX = 0;
	const REMAINING_LETTERS_START = 1;

	return (
		text.charAt(FIRST_LETTER_INDEX).toUpperCase() +
		text.slice(REMAINING_LETTERS_START)
	);
};

export { capitalizeFirstLetter };
