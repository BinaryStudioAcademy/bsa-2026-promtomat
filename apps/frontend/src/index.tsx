import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";

import "~/assets/css/styles.css";
import { App } from "~/libs/components/app/app.js";
import { RouterProvider } from "~/libs/components/router-provider/router-provider.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { store } from "~/libs/modules/store/store.js";
import { Auth } from "~/pages/auth/auth.jsx";
import { NoAccessPage } from "~/pages/no-access/no-access.js";

createRoot(document.querySelector("#root") as HTMLElement).render(
	<StrictMode>
		<StoreProvider store={store}>
			<RouterProvider
				routes={[
					{
						children: [
							{
								element: "Root",
								path: AppRoute.ROOT,
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
								path: AppRoute.NO_ACCESS,
							},
						],
						element: <App />,
						path: AppRoute.ROOT,
					},
				]}
			/>
		</StoreProvider>
	</StrictMode>,
);
