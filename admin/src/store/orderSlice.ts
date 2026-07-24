import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/order.service";
import { Order, OrderStatus } from "../types/order";

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  updating: false,
  error: null,
};

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllOrders();
      return response.orders;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getOrderById(id);
      return response.order;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  "orders/changeStatus",
  async (
    { orderId, status }: { orderId: string; status: OrderStatus },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateOrderStatus(orderId, status);
      return response.order;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.selectedOrder = action.payload;
        }
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(changeOrderStatus.pending, (state) => {
        state.updating = true;
      })
      .addCase(
        changeOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.updating = false;
          state.selectedOrder = action.payload;

          // Keep the list in sync too, so navigating back shows the new status
          const index = state.orders.findIndex(
            (o) => o._id === action.payload._id
          );
          if (index !== -1) state.orders[index] = action.payload;
        }
      )
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;