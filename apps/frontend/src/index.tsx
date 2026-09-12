import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import { Navigate } from "react-router-dom";

import "~/assets/css/styles.css";
import { App } from "~/libs/components/app/app.js";
import { PrivateRoute } from "~/libs/components/private-route/private-route.js";
import { RouterProvider } from "~/libs/components/router-provider/router-provider.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { loadPage } from "~/libs/helpers/helpers.js";
import { store } from "~/libs/modules/store/store.js";
import { Auth } from "~/pages/auth/auth.jsx";
import { ErrorPage } from "~/pages/error/error.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

const NoAccessPage = loadPage(
	() => import("~/pages/no-access/no-access.js"),
	"NoAccessPage",
);
const SettingsPage = loadPage(
	() => import("~/pages/settings/settings.js"),
	"SettingsPage",
);
const Training = loadPage(
	() => import("~/pages/training/training.js"),
	"Training",
);
const Workspaces = loadPage(
	() => import("~/pages/workspaces/workspaces.js"),
	"Workspaces",
);

createRoot(document.querySelector("#root") as HTMLElement).render(
	<StrictMode>
		<StoreProvider store={store}>
			<RouterProvider
				routes={[
					{
						children: [
							{
								element: <Navigate replace to={AppRoute.WORKSPACES} />,
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
								element: (
									<PrivateRoute redirectTo={AppRoute.SIGN_IN}>
										<Workspaces />
									</PrivateRoute>
								),
								path: AppRoute.WORKSPACES,
							},
							{
								element: (
									<PrivateRoute redirectTo={AppRoute.SIGN_IN}>
										<Training />
									</PrivateRoute>
								),
								path: AppRoute.TRAINING,
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
