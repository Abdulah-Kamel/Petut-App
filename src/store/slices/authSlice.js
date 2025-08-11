import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
    },
    loginFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    signupStart(state) {
      state.loading = true
      state.error = null
    },
    signupSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
    },
    signupFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
  clearError,
} = authSlice.actions

export default authSlice.reducer