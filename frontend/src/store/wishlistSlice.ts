import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlist.service";

export interface WishlistItem {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: { url: string; isPrimary: boolean }[];
  };
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWishlist();
      return response.wishlist.products;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const addWishlistItem = createAsyncThunk(
  "wishlist/addItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await addToWishlist(productId);
      return response.wishlist.products;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add to wishlist"
      );
    }
  }
);

export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      await removeFromWishlist(productId);
      return productId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove from wishlist"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    clearWishlistState(state) {
      state.items = [];
    },
    clearWishlistError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (state, action: PayloadAction<WishlistItem[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(
        addWishlistItem.fulfilled,
        (state, action: PayloadAction<WishlistItem[]>) => {
          state.items = action.payload;
        }
      )
      .addCase(addWishlistItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.product._id !== action.payload
        );
      });
  },
});

export const { clearWishlistState, clearWishlistError } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;