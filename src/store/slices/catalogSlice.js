// src/store/slices/catalogSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path to your firebase config

/**
 * Async Thunk for fetching products from Firestore.
 * This function will handle the async request and return the data.
 * Redux Toolkit will automatically dispatch actions based on the Promise status.
 */
export const fetchProducts = createAsyncThunk(
  "catalog/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const productsCollectionRef = collection(db, "products");
      const querySnapshot = await getDocs(productsCollectionRef);
      const formattedProducts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert price to number if it's a string
          price:
            typeof data.price === "string"
              ? parseFloat(data.price)
              : data.price,
          // Convert Firestore timestamps to ISO strings for serialization
          createdAt:
            data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
        };
      });
      return formattedProducts; // This becomes the `action.payload` on success
    } catch (error) {
      console.error("Error fetching products from Firestore:", error);
      // Use rejectWithValue to return a specific error payload
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    // Your standard reducers can go here if you have any.
  },
  // 'extraReducers' handles actions defined outside the slice, like our thunk.
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // The value from rejectWithValue
      });
  },
});

export default catalogSlice.reducer;
