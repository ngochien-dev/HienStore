import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '../../api/axiosClient'

interface CartItem {
  id: number
  productVariant: any
  quantity: number
  subTotal: number
}

interface CartState {
  items: CartItem[]
  totalAmount: number
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  isLoading: false,
  error: null,
}

// Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/cart')
    return response.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Lỗi tải giỏ hàng')
  }
})

export const addToCart = createAsyncThunk('cart/addToCart', async ({ variantId, quantity }: { variantId: number, quantity: number }, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/cart/items', { variantId, quantity })
    return response.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Lỗi thêm vào giỏ hàng')
  }
})

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ itemId, quantity }: { itemId: number, quantity: number }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/cart/items/${itemId}?quantity=${quantity}`)
    return response.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Lỗi cập nhật số lượng')
  }
})

export const removeItem = createAsyncThunk('cart/removeItem', async (itemId: number, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/api/cart/items/${itemId}`)
    return response.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Lỗi xóa sản phẩm')
  }
})

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = []
      state.totalAmount = 0
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => { state.isLoading = true })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items || []
        state.totalAmount = action.payload.totalAmount || 0
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.totalAmount = action.payload.totalAmount || 0
      })
      // Update Quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.totalAmount = action.payload.totalAmount || 0
      })
      // Remove Item
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.totalAmount = action.payload.totalAmount || 0
      })
  },
})

export const { clearCartState } = cartSlice.actions
export default cartSlice.reducer
