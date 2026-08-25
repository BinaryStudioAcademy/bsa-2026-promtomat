import { redirect } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

const requireAuthLoader = async (): Promise<null | Response> => {
	const hasToken = await storage.has(StorageKey.TOKEN);

	return hasToken ? null : redirect(AppRoute.SIGN_IN);
};

const requireGuestLoader = async (): Promise<null | Response> => {
	const hasToken = await storage.has(StorageKey.TOKEN);

	return hasToken ? redirect(AppRoute.ROOT) : null;
};

export { requireAuthLoader, requireGuestLoader };
