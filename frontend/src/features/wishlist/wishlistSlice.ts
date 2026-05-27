import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosClient'

interface WishlistState {
  items: number[] // Array of product IDs
  isLoading: boolean
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
}

export const fetchWishlistIds = createAsyncThunk(
  'wishlist/fetchIds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/wishlist/ids')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch wishlist')
    }
  }
)

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggle',
  async (productId: number, { rejectWithValue }) => {
    try {
      await api.post(`/api/wishlist/${productId}/toggle`)
      return productId
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to toggle wishlist')
    }
  }
)

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistIds.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchWishlistIds.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchWishlistIds.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        const productId = action.payload
        if (state.items.includes(productId)) {
          state.items = state.items.filter(id => id !== productId)
        } else {
          state.items.push(productId)
        }
      })
  },
})

export const { clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
