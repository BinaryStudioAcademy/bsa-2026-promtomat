import { type ComponentType, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import { Navigate } from "react-router-dom";

import "~/assets/css/styles.css";
import { App } from "~/libs/components/app/app.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PrivateRoute } from "~/libs/components/private-route/private-route.js";
import { RouterProvider } from "~/libs/components/router-provider/router-provider.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { store } from "~/libs/modules/store/store.js";
import { ErrorPage } from "~/pages/error/error.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";
import { PasswordReset } from "~/pages/password-reset/password-reset.js";

const loadAuthPage = async (): Promise<{ Component: ComponentType }> => {
	const pageModule = await import("~/pages/auth/auth.jsx");

	return { Component: pageModule.Auth };
};

createRoot(document.querySelector("#root") as HTMLElement).render(
	<StrictMode>
		<StoreProvider store={store}>
			<RouterProvider
				routes={[
					{
						children: [
							{
								children: [
									{
										element: <Navigate replace to={AppRoute.WORKSPACES} />,
										index: true,
									},
									{
										lazy: async () => {
											const pageModule =
												await import("~/pages/no-access/no-access.js");

											return { Component: pageModule.NoAccessPage };
										},
										path: AppRoute.NO_ACCESS,
									},
									{
										lazy: async () => {
											const pageModule =
												await import("~/pages/settings/settings.js");

											return { Component: pageModule.SettingsPage };
										},
										path: AppRoute.SETTINGS,
									},
									{
										lazy: async () => {
											const pageModule =
												await import("~/pages/smart-search/smart-search.js");

											return { Component: pageModule.SmartSearch };
										},
										path: AppRoute.SMART_SEARCH,
									},
									{
										lazy: async () => {
											const pageModule =
												await import("~/pages/training/training.js");

											return { Component: pageModule.Training };
										},
										path: AppRoute.TRAINING,
									},
									{
										lazy: async () => {
											const pageModule =
												await import("~/pages/workspaces/workspaces.js");

											return { Component: pageModule.Workspaces };
										},
										path: AppRoute.WORKSPACES,
									},
								],
								element: <PrivateRoute redirectTo={AppRoute.SIGN_IN} />,
								hydrateFallbackElement: <Loader />,
							},
							{
								hydrateFallbackElement: <Loader />,
								lazy: loadAuthPage,
								path: AppRoute.SIGN_IN,
							},
							{
								hydrateFallbackElement: <Loader />,
								lazy: loadAuthPage,
								path: AppRoute.SIGN_UP,
							},
							{
								element: <PasswordReset />,
								path: AppRoute.FORGOT_PASSWORD,
							},
							{
								element: <PasswordReset />,
								path: AppRoute.RESET_PASSWORD,
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
