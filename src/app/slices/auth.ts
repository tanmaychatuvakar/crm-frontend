import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { api } from "../services/api";

interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
};

type JwtPayload = Omit<User, "id"> & { sub: string };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      const decoded = jwtDecode<JwtPayload>(action.payload);
      state.isLoggedIn = true;
      state.token = action.payload;
      state.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
    },
  },
  extraReducers(builder) {
    builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
    });
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
