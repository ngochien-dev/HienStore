import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosClient'

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/orders', orderData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async ({ page = 0, size = 10 }: { page?: number, size?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/orders?page=${page}&size=${size}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchAdminOrders = createAsyncThunk(
  'order/fetchAdminOrders',
  async ({ page = 0, size = 20 }: { page?: number, size?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/admin/orders?page=${page}&size=${size}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status, paymentStatus }: { orderId: number, status?: string, paymentStatus?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/orders/${orderId}/status`, { status, paymentStatus })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

interface OrderState {
  orders: any[]
  currentOrder: any | null
  isLoading: boolean
  error: string | null
  pageInfo: {
    totalPages: number
    totalElements: number
    size: number
    number: number
  } | null
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pageInfo: null
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    }
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload.content
        state.pageInfo = {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
          number: action.payload.number
        }
      })
      // fetchAdminOrders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload.content
        state.pageInfo = {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
          number: action.payload.number
        }
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // updateOrderStatus
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
  },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
