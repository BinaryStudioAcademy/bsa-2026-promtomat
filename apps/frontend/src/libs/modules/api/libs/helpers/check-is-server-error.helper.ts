import { type ServerError } from "../types/server-error.type.js";

const checkIsServerError = (error: unknown): error is ServerError => {
	return typeof error === "object" && error !== null && "code" in error;
};

export { checkIsServerError };
