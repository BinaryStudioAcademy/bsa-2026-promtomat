const ROOT_ELEMENT_SELECTOR = "#root";
const CSS_FULL_WIDTH = "100%";

const lockPage = (): VoidFunction => {
	const root = document.querySelector(ROOT_ELEMENT_SELECTOR);
	const scrollPosition = window.scrollY;
	const { style: bodyStyle } = document.body;
	const previousOverflow = bodyStyle.overflow;
	const previousPosition = bodyStyle.position;
	const previousTop = bodyStyle.top;
	const previousWidth = bodyStyle.width;

	if (root instanceof HTMLElement) {
		root.inert = true;
	}

	bodyStyle.overflow = "hidden";
	bodyStyle.position = "fixed";
	bodyStyle.top = `-${String(scrollPosition)}px`;
	bodyStyle.width = CSS_FULL_WIDTH;

	return () => {
		if (root instanceof HTMLElement) {
			root.inert = false;
		}

		bodyStyle.overflow = previousOverflow;
		bodyStyle.position = previousPosition;
		bodyStyle.top = previousTop;
		bodyStyle.width = previousWidth;
		window.scrollTo({ top: scrollPosition });
	};
};

export { lockPage };
