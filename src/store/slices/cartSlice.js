import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserCart, setUserCart, deleteUserCart } from "../../firebase";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

// Async thunk: Load cart from Firestore
export const loadCartFromFirestore = createAsyncThunk(
  "cart/loadCartFromFirestore",
  async (uid, { rejectWithValue }) => {
    try {
      const cart = await getUserCart(uid);
      return cart || { items: [], totalQuantity: 0, totalAmount: 0 };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk: Save cart to Firestore
export const saveCartToFirestore = createAsyncThunk(
  "cart/saveCartToFirestore",
  async ({ uid, cart }, { rejectWithValue }) => {
    try {
      await setUserCart(uid, cart);
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk: Clear cart in Firestore
export const clearCartInFirestore = createAsyncThunk(
  "cart/clearCartInFirestore",
  async (uid, { rejectWithValue }) => {
    try {
      await deleteUserCart(uid);
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      }

      state.totalQuantity++;
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      }

      state.totalQuantity--;
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    clearCart(state) {
      return initialState;
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        const quantityChange = quantity - item.quantity;
        item.quantity = quantity;
        item.totalPrice = item.price * quantity;

        state.totalQuantity += quantityChange;
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCartFromFirestore.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(loadCartFromFirestore.rejected, (state, action) => {
        // Optionally handle error state
      });
    // Optionally handle save/clear fulfilled/rejected if you want to show status
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;

