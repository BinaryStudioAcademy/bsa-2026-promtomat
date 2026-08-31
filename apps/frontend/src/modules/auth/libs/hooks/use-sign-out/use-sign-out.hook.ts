import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

const useSignOut = (): (() => Promise<void>) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	return useCallback(async (): Promise<void> => {
		await storage.drop(StorageKey.TOKEN);

		dispatch(baseApi.util.resetApiState());

		void navigate(AppRoute.SIGN_IN, { replace: true });
	}, [dispatch, navigate]);
};

export { useSignOut };
