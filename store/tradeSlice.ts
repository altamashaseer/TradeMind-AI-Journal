import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Trade } from '../types';
import { api } from '../services/api';

interface TradeState {
  items: Trade[];
  isLoading: boolean;
  error: string | null;
  backendConnected: boolean;
}

const initialState: TradeState = {
  items: [],
  isLoading: false,
  error: null,
  backendConnected: true,
};

// Async Thunks
export const fetchTrades = createAsyncThunk(
  'trades/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.trades.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createTrade = createAsyncThunk(
  'trades/create',
  async (trade: Omit<Trade, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      return await api.trades.create(trade);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const editTrade = createAsyncThunk(
  'trades/edit',
  async (trade: Trade, { rejectWithValue }) => {
    try {
      return await api.trades.update(trade);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeTrade = createAsyncThunk(
  'trades/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.trades.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const tradeSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTrades.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.backendConnected = true;
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // If fetch fails, we assume backend might be down
        state.backendConnected = false;
      })
      // Create
      .addCase(createTrade.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      // Edit
      .addCase(editTrade.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Remove
      .addCase(removeTrade.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      });
  },
});

export default tradeSlice.reducer;
