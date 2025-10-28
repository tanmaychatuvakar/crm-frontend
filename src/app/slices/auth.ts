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

const getInitialToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  isLoggedIn: false,
  token: getInitialToken(),
  user: getInitialToken() ? (() => {
    try {
      const decoded = jwtDecode<Omit<User, "id"> & { sub: string }>(getInitialToken()!);
      return {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  })() : null,
};

type JwtPayload = Omit<User, "id"> & { sub: string };

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...initialState,
    isLoggedIn: !!initialState.token,
  },
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
      
      try {
        localStorage.setItem("token", action.payload);
      } catch {
        // localStorage may not be available
      }
    },
  },
  extraReducers(builder) {
    builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      
      try {
        localStorage.removeItem("token");
      } catch {
        // localStorage may not be available
      }
    });
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
