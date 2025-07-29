import { configureStore } from '@reduxjs/toolkit'
import catalogReducer from './slices/catalogSlice'
import filterReducer from './slices/filterSlice'
import cartReducer from './slices/cartSlice'
import authReducer from './slices/authSlice'
import favoritesReducer from './slices/favoritesSlice'
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    filter: filterReducer,
    cart: cartReducer,
    auth: authReducer,
    favorites: favoritesReducer,
    orders: orderReducer,
  },
});