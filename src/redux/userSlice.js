import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,  
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authSignIn: (state) => {
      state.loading = true;
    },
    authSignInComplete: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    authSignInRejected: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    authSignOut: (state) => {
      state.loading = true;
    },
    authSignOutComplete: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    authSignOutRejected: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});


export const {
  authSignIn,
  authSignInComplete,
  authSignInRejected,
  authSignOut,
  authSignOutComplete,
  authSignOutRejected,
} = userSlice.actions;

export default userSlice.reducer;
