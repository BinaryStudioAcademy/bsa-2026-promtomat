type ClassName = false | null | string | undefined;

const getValidClasses = (...classNames: ClassName[]): string =>
	classNames.filter(Boolean).join(" ");

export { getValidClasses };
