import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
  clearCart,
  applyCoupon,
} from "../services/cart.service";

export interface CartItem {
  product: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  discount: number;
  couponCode: string;
  subtotal: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  discount: 0,
  couponCode: "",
  subtotal: 0,
  totalItems: 0,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCart();
      return response.cart;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await addToCart(productId, quantity);
      return response.cart;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateCart(productId, quantity);
      return response.cart;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await removeCartItem(productId);
      return response.cart;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const emptyCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await clearCart();
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

export const applyCartCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async (couponCode: string, { rejectWithValue }) => {
    try {
      const response = await applyCoupon(couponCode);
      return response.cart;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid coupon"
      );
    }
  }
);

const applyCartToState = (
  state: CartState,
  cart: { items: CartItem[]; discount?: number; couponCode?: string }
) => {
  state.items = cart.items || [];
  state.discount = cart.discount || 0;
  state.couponCode = cart.couponCode || "";

  state.subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  state.totalItems = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        applyCartToState(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addItemToCart.fulfilled, (state, action) => {
        applyCartToState(state, action.payload);
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        applyCartToState(state, action.payload);
      })

      .addCase(deleteCartItem.fulfilled, (state, action) => {
        applyCartToState(state, action.payload);
      })

      .addCase(emptyCart.fulfilled, (state) => {
        state.items = [];
        state.discount = 0;
        state.couponCode = "";
        state.subtotal = 0;
        state.totalItems = 0;
      })

      .addCase(applyCartCoupon.fulfilled, (state, action) => {
        applyCartToState(state, action.payload);
      })
      .addCase(applyCartCoupon.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearCartError } = cartSlice.actions;

export default cartSlice.reducer;