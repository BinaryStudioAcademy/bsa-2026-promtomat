import { useSelector } from "react-redux";

import { type RootState } from "~/libs/modules/store/store.js";

const useAppSelector = useSelector.withTypes<RootState>();

export { useAppSelector };
