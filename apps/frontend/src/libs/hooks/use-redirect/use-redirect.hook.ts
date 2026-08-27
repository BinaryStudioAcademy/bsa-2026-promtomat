import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { clearRedirect } from "~/libs/modules/navigation/navigation.slice.js";

import { useAppDispatch } from "../use-app-dispatch/use-app-dispatch.hook.js";
import { useAppSelector } from "../use-app-selector/use-app-selector.hook.js";

const useRedirect = (): void => {
	const redirectTo = useAppSelector((state) => state.navigation.redirectTo);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (redirectTo === null) {
			return;
		}

		void navigate(redirectTo);
		//A one-shot event stored as state must be cleared. Skip the clear and the user is trapped on a loop
		dispatch(clearRedirect());
	}, [redirectTo, navigate, dispatch]);
};

export { useRedirect };
