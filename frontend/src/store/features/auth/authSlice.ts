import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async ({
    phoneNumber,
    userType,
  }: {
    phoneNumber: string;
    userType: string;
  }) => {
    return await authApi.sendOTP(phoneNumber, userType);
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({
    phoneNumber,
    otp,
    userType,
  }: {
    phoneNumber: string;
    otp: string;
    userType: string;
  }) => {
    return await authApi.verifyOTP(phoneNumber, otp, userType);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Verification failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
