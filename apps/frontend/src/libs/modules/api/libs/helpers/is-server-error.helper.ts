import { type ServerError } from "../types/server-error.type.js";

const isServerError = (error: unknown): error is ServerError => {
	return typeof error === "object" && error !== null && "code" in error;
};

export { isServerError };
