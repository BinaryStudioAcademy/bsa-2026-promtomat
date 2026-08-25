import { createSlice } from "@reduxjs/toolkit";

import { signIn } from "./auth-api.js";
import { type SignInResponseDto } from "./libs/types/types.js";

type State = {
	user: null | SignInResponseDto["user"];
};

const initialState: State = {
	user: null,
};

const { reducer } = createSlice({
	extraReducers(builder) {
		builder.addMatcher(signIn.matchFulfilled, (state, action) => {
			state.user = action.payload.user;
		});
	},
	initialState: initialState,
	name: "auth",
	reducers: {},
});

export { reducer as authReducer };
