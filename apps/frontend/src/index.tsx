import { type ComponentType, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import { Navigate } from "react-router-dom";

import "~/assets/css/styles.css";
import { App } from "~/libs/components/app/app.js";
import { AuthenticatedShell } from "~/libs/components/authenticated-shell/authenticated-shell.js";
import {
	GENERATE_PAGE_COPY,
	PROFILE_PAGE_COPY,
	SETTINGS_PAGE_COPY,
	SMART_SEARCH_PAGE_COPY,
	TRAINING_PAGE_COPY,
	WORKSPACES_PAGE_COPY,
} from "~/libs/components/authenticated-shell/libs/constants/constants.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PrivateRoute } from "~/libs/components/private-route/private-route.js";
import { RouterProvider } from "~/libs/components/router-provider/router-provider.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { store } from "~/libs/modules/store/store.js";
import { ErrorPage } from "~/pages/error/error.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

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
										children: [
											{
												element: <Navigate replace to={AppRoute.WORKSPACES} />,
												index: true,
											},
											{
												handle: PROFILE_PAGE_COPY,
												lazy: async () => {
													const pageModule =
														await import("~/pages/profile/profile.js");

													return { Component: pageModule.Profile };
												},
												path: AppRoute.PROFILE,
											},
											{
												handle: SETTINGS_PAGE_COPY,
												lazy: async () => {
													const pageModule =
														await import("~/pages/settings/settings.js");

													return { Component: pageModule.SettingsPage };
												},
												path: AppRoute.SETTINGS,
											},
											{
												handle: TRAINING_PAGE_COPY,
												lazy: async () => {
													const pageModule =
														await import("~/pages/training/training.js");

													return { Component: pageModule.Training };
												},
												path: AppRoute.TRAINING,
											},
											{
												handle: GENERATE_PAGE_COPY,
												lazy: async () => {
													const pageModule =
														await import("~/pages/generate/generate.js");

													return { Component: pageModule.Generate };
												},
												path: AppRoute.GENERATE,
											},
											{
												handle: WORKSPACES_PAGE_COPY,
												lazy: async () => {
													const pageModule =
														await import("~/pages/workspaces/workspaces.js");

													return { Component: pageModule.Workspaces };
												},
												path: AppRoute.WORKSPACES,
											},
											{
												handle: SMART_SEARCH_PAGE_COPY,
												lazy: async () => {
													const pageModule =
														await import("~/pages/prompt-history/prompt-history.js");

													return { Component: pageModule.PromptHistory };
												},
												path: AppRoute.PROMPTS_HISTORY,
											},
										],
										element: <AuthenticatedShell />,
									},
									{
										lazy: async () => {
											const pageModule =
												await import("~/pages/no-access/no-access.js");

											return { Component: pageModule.NoAccessPage };
										},
										path: AppRoute.NO_ACCESS,
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
