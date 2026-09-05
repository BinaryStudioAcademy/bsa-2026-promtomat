import { useCallback } from "react";

import { AppRoute } from "~/libs/enums/enums.js";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { setRedirect } from "~/libs/modules/navigation/navigation.slice.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

const useSignOut = (): (() => Promise<void>) => {
	const dispatch = useAppDispatch();

	return useCallback(async (): Promise<void> => {
		await storage.drop(StorageKey.TOKEN);

		dispatch(baseApi.util.resetApiState());

		dispatch(
			setRedirect({
				replace: true,
				to: AppRoute.SIGN_IN,
			}),
		);
	}, [dispatch]);
};

export { useSignOut };
