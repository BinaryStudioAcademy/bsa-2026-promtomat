import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";

import "~/assets/css/styles.css";
import { App } from "~/libs/components/app/app.js";
import { RouterProvider } from "~/libs/components/router-provider/router-provider.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { store } from "~/libs/modules/store/store.js";
import {
	authMiddleware,
	noAccessMiddleware,
} from "~/modules/auth/libs/middlewares/middlewares.js";
import { Auth } from "~/pages/auth/auth.jsx";
import { ErrorPage } from "~/pages/error/error.js";
import { NoAccessPage } from "~/pages/no-access/no-access.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

createRoot(document.querySelector("#root") as HTMLElement).render(
	<StrictMode>
		<StoreProvider store={store}>
			<RouterProvider
				routes={[
					{
						children: [
							{
								element: <p>Root</p>,
								index: true,
								middleware: [authMiddleware, noAccessMiddleware],
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
								element: <NoAccessPage />,
								middleware: [authMiddleware],
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
