import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { placeOrder, getUserOrders } from "../../firebase";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  lastOrderId: null,
};

// Place a new order
export const placeOrderThunk = createAsyncThunk(
  "orders/placeOrder",
  async ({ uid, orderData }, { rejectWithValue }) => {
    try {
      const orderId = await placeOrder(uid, orderData);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all orders for a user
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (uid, { rejectWithValue }) => {
    try {
      const orders = await getUserOrders(uid);
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearLastOrderId(state) {
      state.lastOrderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrderId = action.payload;
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLastOrderId } = orderSlice.actions;
export default orderSlice.reducer;
