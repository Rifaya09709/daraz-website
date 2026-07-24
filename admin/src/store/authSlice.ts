import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { login, getProfile, logoutApi, LoginData } from "../services/auth.service";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "seller" | "admin";
}

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("admin_token"),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("admin_token"),
};

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await login(data);

      if (response.user.role !== "admin") {
        return rejectWithValue(
          "Access denied. This account does not have admin privileges."
        );
      }

      localStorage.setItem("admin_token", response.token);
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const fetchAdminProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();

      if (response.user.role !== "admin") {
        return rejectWithValue("Access denied.");
      }

      return response.user;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const logoutAdmin = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutApi();
  } catch {
    // Ignore server errors on logout; clear client state regardless
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })

      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("admin_token");
      })

      .addCase(logoutAdmin.fulfilled, (state) => {
        localStorage.removeItem("admin_token");
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;