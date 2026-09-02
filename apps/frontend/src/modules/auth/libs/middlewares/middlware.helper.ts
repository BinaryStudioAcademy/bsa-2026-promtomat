import { store } from "~/libs/modules/store/store.js";

import { authenticatedUserEndpoint } from "../../auth-api.js";

const middleware = async (
	onError: (error: unknown) => Promise<void>,
	next: () => Promise<unknown>,
) => {
	const result = store.dispatch(
		authenticatedUserEndpoint.initiate(undefined, { forceRefetch: true }),
	);
	try {
		await result.unwrap();
	} catch (error) {
		await onError(error);
	} finally {
		result.unsubscribe();
	}

	return await next();
};

export { middleware };
