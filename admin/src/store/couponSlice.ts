import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
  CreateCouponData,
  UpdateCouponData,
} from "../services/coupon.service";
import { Coupon } from "../types/coupon";

interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  saving: false,
  error: null,
};

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCoupons();
      return response.coupons;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch coupons"
      );
    }
  }
);

export const addCoupon = createAsyncThunk(
  "coupons/create",
  async (data: CreateCouponData, { rejectWithValue }) => {
    try {
      const response = await createCoupon(data);
      return response.coupon;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create coupon"
      );
    }
  }
);

export const editCoupon = createAsyncThunk(
  "coupons/update",
  async (
    { id, data }: { id: string; data: UpdateCouponData },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateCoupon(id, data);
      return response.coupon;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update coupon"
      );
    }
  }
);

export const toggleCoupon = createAsyncThunk(
  "coupons/toggle",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await toggleCouponStatus(id);
      return response.coupon;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle coupon"
      );
    }
  }
);

export const removeCoupon = createAsyncThunk(
  "coupons/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCoupon(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete coupon"
      );
    }
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    clearCouponError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCoupons.fulfilled,
        (state, action: PayloadAction<Coupon[]>) => {
          state.loading = false;
          state.coupons = action.payload;
        }
      )
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addCoupon.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(
        addCoupon.fulfilled,
        (state, action: PayloadAction<Coupon>) => {
          state.saving = false;
          state.coupons.unshift(action.payload);
        }
      )
      .addCase(addCoupon.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })

      .addCase(
        editCoupon.fulfilled,
        (state, action: PayloadAction<Coupon>) => {
          const index = state.coupons.findIndex(
            (c) => c._id === action.payload._id
          );
          if (index !== -1) state.coupons[index] = action.payload;
        }
      )

      .addCase(
        toggleCoupon.fulfilled,
        (state, action: PayloadAction<Coupon>) => {
          const index = state.coupons.findIndex(
            (c) => c._id === action.payload._id
          );
          if (index !== -1) state.coupons[index] = action.payload;
        }
      )

      .addCase(
        removeCoupon.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.coupons = state.coupons.filter(
            (c) => c._id !== action.payload
          );
        }
      );
  },
});

export const { clearCouponError } = couponSlice.actions;

export default couponSlice.reducer;