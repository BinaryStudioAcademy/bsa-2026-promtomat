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

		if (redirectTo !== location.pathname) {
			void navigate(redirectTo);
		}

		dispatch(clearRedirect());
	}, [redirectTo, navigate, dispatch]);
};

export { useRedirect };
