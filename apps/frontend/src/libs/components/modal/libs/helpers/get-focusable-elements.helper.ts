const FOCUSABLE_SELECTOR =
	"a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
	return [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
};

export { getFocusableElements };
