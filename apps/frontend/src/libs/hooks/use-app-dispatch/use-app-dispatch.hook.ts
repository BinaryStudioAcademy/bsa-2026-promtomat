import { useDispatch } from "react-redux";

import { type AppDispatch } from "~/libs/modules/store/store.module.js";

const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export { useAppDispatch };
