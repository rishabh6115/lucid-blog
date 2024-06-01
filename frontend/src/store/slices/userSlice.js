import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSignedIn: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.isSignedIn = true;
      action.payload?.token &&
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      state.user = action.payload;
    },
    signOut: (state) => {
      state.isSignedIn = false;
      localStorage.removeItem("token");
      state.user = null;
    },
  },
});

export const { signIn, signOut } = userSlice.actions;

export default userSlice.reducer;
