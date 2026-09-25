import { type ComponentType, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import { Navigate } from "react-router-dom";

import "~/assets/css/styles.css";
import { App } from "~/libs/components/app/app.js";
import { AuthenticatedShell } from "~/libs/components/authenticated-shell/authenticated-shell.js";
import { ShellPageCopy } from "~/libs/components/authenticated-shell/libs/enums/enums.js";
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
										children: [
											{
												element: <Navigate replace to={AppRoute.WORKSPACES} />,
												index: true,
											},
											{
												handle: ShellPageCopy.PROFILE,
												lazy: async () => {
													const pageModule =
														await import("~/pages/profile/profile.js");

													return { Component: pageModule.Profile };
												},
												path: AppRoute.PROFILE,
											},
											{
												handle: ShellPageCopy.API_TOKENS,
												lazy: async () => {
													const pageModule =
														await import("~/pages/api-tokens/api-tokens.js");

													return { Component: pageModule.ApiTokensPage };
												},
												path: AppRoute.API_TOKENS,
											},
											{
												handle: ShellPageCopy.TRAINING,
												lazy: async () => {
													const pageModule =
														await import("~/pages/training/training.js");

													return { Component: pageModule.Training };
												},
												path: AppRoute.TRAINING,
											},
											{
												handle: ShellPageCopy.GENERATE,
												lazy: async () => {
													const pageModule =
														await import("~/pages/generate/generate.js");

													return { Component: pageModule.Generate };
												},
												path: AppRoute.GENERATE,
											},
											{
												handle: ShellPageCopy.WORKSPACES,
												lazy: async () => {
													const pageModule =
														await import("~/pages/workspaces/workspaces.js");

													return { Component: pageModule.Workspaces };
												},
												path: AppRoute.WORKSPACES,
											},
											{
												handle: ShellPageCopy.WORKSPACE_CONFIG,
												lazy: async () => {
													const pageModule =
														await import("~/pages/workspace-config/workspace-config.js");

													return { Component: pageModule.WorkspaceConfig };
												},
												path: AppRoute.WORKSPACES_$WORKSPACE_ID_CONFIG,
											},
											{
												handle: ShellPageCopy.SMART_SEARCH,
												lazy: async () => {
													const pageModule =
														await import("~/pages/prompt-history/prompt-history.js");

													return { Component: pageModule.PromptHistory };
												},
												path: AppRoute.SMART_SEARCH,
											},
											{
												handle: ShellPageCopy.ANALYTICS,
												lazy: async () => {
													const pageModule =
														await import("~/pages/analytics/analytics.js");

													return { Component: pageModule.Analytics };
												},
												path: AppRoute.ANALYTICS,
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
									{
										lazy: async () => {
											const pageModule =
												await import("~/pages/prompt-delivery/prompt-delivery.js");

											return { Component: pageModule.PromptDelivery };
										},
										path: AppRoute.PROMPTS_$PROMPT_ID,
									},
									{
										lazy: async () => {
											const pageModule =
												await import("~/pages/prompt-delivery/prompt-delivery.js");

											return { Component: pageModule.PromptDelivery };
										},
										path: AppRoute.PROMPTS_$PROMPT_ID,
									},
									{
										lazy: async () => {
											const pageModule =
												await import("~/pages/prompt-delivery/prompt-delivery.js");

											return { Component: pageModule.PromptDelivery };
										},
										path: AppRoute.COMPOSED_PROMPTS_$COMPOSED_PROMPT_ID,
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
