import { useDispatch } from "react-redux";

import { type AppDispatch } from "~/libs/modules/store/store.js";

const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export { useAppDispatch };
