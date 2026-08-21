import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setUser(state, action: PayloadAction<IUser | null>) {
      //  console.log("Payload received:", action.payload);
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    setLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { setLoading, setUser, setLogout } = authSlice.actions;
export default authSlice.reducer;
