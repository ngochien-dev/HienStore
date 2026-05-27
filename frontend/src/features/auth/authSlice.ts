import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  email: string
  fullName: string
  role: string
  phone?: string
  point: number
  userType: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    }
  },
})

export const { setCredentials, logout, updateUser } = authSlice.actions

export default authSlice.reducer
