import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
  ProductQuery,
} from "../services/product.service";
import { Product } from "../types/product";

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: ProductQuery | undefined, { rejectWithValue }) => {
    try {
      const response = await getProducts(params);
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getProductById(id);
      return response.product;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearProductError(state) {
      state.error = null;
    },
    // Optimistic removal after delete, so admin doesn't have to refetch the whole list
    removeProductFromState(state, action: PayloadAction<string>) {
      state.products = state.products.filter(
        (p) => p._id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[];
            page: number;
            totalPages: number;
            totalProducts: number;
          }>
        ) => {
          state.loading = false;
          state.products = action.payload.products;
          state.currentPage = action.payload.page;
          state.totalPages = action.payload.totalPages;
          state.totalProducts = action.payload.totalProducts;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.selectedProduct = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearSelectedProduct,
  clearProductError,
  removeProductFromState,
} = productSlice.actions;

export default productSlice.reducer;