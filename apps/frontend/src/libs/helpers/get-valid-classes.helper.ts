import clsx from "clsx";

type ClassValue = Parameters<typeof clsx>[number];

const getValidClasses = (...classes: ClassValue[]): string => clsx(...classes);

export { getValidClasses };
