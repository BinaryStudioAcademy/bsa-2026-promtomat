import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { clearRedirect } from "~/libs/modules/navigation/navigation.slice.js";

import { useAppDispatch } from "../use-app-dispatch/use-app-dispatch.hook.js";
import { useAppSelector } from "../use-app-selector/use-app-selector.hook.js";

const useRedirect = (): void => {
	const redirect = useAppSelector((state) => state.navigation.redirect);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	useEffect(() => {
		if (redirect === null) {
			return;
		}

		const { replace, to } = redirect;

		if (to !== pathname) {
			void navigate(to, {
				replace,
			});
		}

		dispatch(clearRedirect());
	}, [redirect, pathname, navigate, dispatch]);
};

export { useRedirect };
