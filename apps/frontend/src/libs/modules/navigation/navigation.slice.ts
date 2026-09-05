import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type Redirect } from "./libs/types/redirect.type.js";

type NavigationState = {
	redirect: null | Redirect;
};

const initialState: NavigationState = {
	redirect: null,
};

const navigationSlice = createSlice({
	initialState,
	name: "navigation",
	reducers: {
		clearRedirect: (state) => {
			state.redirect = null;
		},
		setRedirect: (state, action: PayloadAction<Redirect>) => {
			state.redirect = action.payload;
		},
	},
});

const { clearRedirect, setRedirect } = navigationSlice.actions;
const navigationReducer = navigationSlice.reducer;

export { clearRedirect, navigationReducer, setRedirect };
