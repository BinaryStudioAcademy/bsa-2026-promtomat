import clsx, { type ClassValue } from "clsx";

const getValidClasses = (...classes: ClassValue[]): string => clsx(...classes);

export { getValidClasses };
