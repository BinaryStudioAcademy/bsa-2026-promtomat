import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type NavigationState = {
	redirectTo: null | ValueOf<typeof AppRoute>;
};

const initialState: NavigationState = {
	redirectTo: null,
};

const navigationSlice = createSlice({
	initialState,
	name: "navigation",
	reducers: {
		clearRedirect: (state) => {
			state.redirectTo = null;
		},
		setRedirect: (state, action: PayloadAction<ValueOf<typeof AppRoute>>) => {
			state.redirectTo = action.payload;
		},
	},
});

const { clearRedirect, setRedirect } = navigationSlice.actions;
const navigationReducer = navigationSlice.reducer;

export { clearRedirect, navigationReducer, setRedirect };
