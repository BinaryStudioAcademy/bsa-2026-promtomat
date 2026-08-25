import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { AppEnvironment } from "~/libs/enums/enums.js";
import { baseApi } from "~/libs/modules/api/base-api.js";
import { type Config } from "~/libs/modules/config/config.js";
import { authReducer } from "~/modules/auth/auth-slice.js";

const createStore = (config: Config) => {
	const store = configureStore({
		devTools: config.ENV.APP.ENVIRONMENT !== AppEnvironment.PRODUCTION,
		middleware: (getDefaultMiddleware) => {
			return getDefaultMiddleware().concat(baseApi.middleware);
		},
		reducer: {
			auth: authReducer,
			[baseApi.reducerPath]: baseApi.reducer,
		},
	});

	setupListeners(store.dispatch);

	return store;
};

type AppDispatch = AppStore["dispatch"];

type AppStore = ReturnType<typeof createStore>;

type RootState = ReturnType<AppStore["getState"]>;

export { type AppDispatch, type RootState, createStore };
