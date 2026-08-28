import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

type StartSessionOptions = {
	cacheAuthenticatedUser: () => Promise<void> | void;
	token: string;
};

const startSession = async ({
	cacheAuthenticatedUser,
	token,
}: StartSessionOptions): Promise<void> => {
	await storage.set(StorageKey.TOKEN, token);

	try {
		await cacheAuthenticatedUser();
	} catch (error) {
		await storage.drop(StorageKey.TOKEN);
		throw error;
	}
};

export { startSession };
