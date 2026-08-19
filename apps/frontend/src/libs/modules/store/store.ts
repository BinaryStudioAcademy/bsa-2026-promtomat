import { config } from "~/libs/modules/config/config.js";

import { createStore } from "./store.module.js";

const store = createStore(config);

export { store };
export { type AppDispatch, type RootState } from "./store.module.js";
