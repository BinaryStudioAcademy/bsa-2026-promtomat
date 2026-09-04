import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";

import "~/assets/css/styles.css";
import { App } from "~/libs/components/app/app.js";
import { PrivateRoute } from "~/libs/components/private-route/private-route.js";
import { RouterProvider } from "~/libs/components/router-provider/router-provider.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { store } from "~/libs/modules/store/store.js";
import { Auth } from "~/pages/auth/auth.jsx";
import { ErrorPage } from "~/pages/error/error.js";
import { Home } from "~/pages/home/home.js";
import { NoAccessPage } from "~/pages/no-access/no-access.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";
import { SettingsPage } from "~/pages/settings/settings.js";

createRoot(document.querySelector("#root") as HTMLElement).render(
	<StrictMode>
		<StoreProvider store={store}>
			<RouterProvider
				routes={[
					{
						children: [
							{
								element: (
									<PrivateRoute redirectTo={AppRoute.SIGN_IN}>
										<Home />
									</PrivateRoute>
								),
								index: true,
							},
							{
								element: (
									<PrivateRoute redirectTo={AppRoute.SIGN_IN}>
										<SettingsPage />
									</PrivateRoute>
								),
								path: AppRoute.SETTINGS,
							},
							{
								element: <Auth />,
								path: AppRoute.SIGN_IN,
							},
							{
								element: <Auth />,
								path: AppRoute.SIGN_UP,
							},
							{
								element: (
									<PrivateRoute redirectTo={AppRoute.SIGN_IN}>
										<NoAccessPage />
									</PrivateRoute>
								),
								path: AppRoute.NO_ACCESS,
							},
							{
								element: <NotFoundPage />,
								path: AppRoute.ANY,
							},
						],
						element: <App />,
						errorElement: <ErrorPage />,
						path: AppRoute.ROOT,
					},
				]}
			/>
		</StoreProvider>
	</StrictMode>,
);
