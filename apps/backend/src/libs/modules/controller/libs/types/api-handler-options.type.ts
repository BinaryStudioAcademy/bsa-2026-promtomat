import { type AuthPayload } from "~/libs/modules/server-application/libs/types/auth-payload.type.js";

type APIHandlerOptions<
	T extends DefaultApiHandlerOptions = DefaultApiHandlerOptions,
> = {
	body: T["body"];
	params: T["params"];
	query: T["query"];
	user: AuthPayload | null;
};

type DefaultApiHandlerOptions = {
	body?: unknown;
	params?: unknown;
	query?: unknown;
};

export { type APIHandlerOptions };
