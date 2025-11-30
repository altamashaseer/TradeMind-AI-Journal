import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tradeReducer from './tradeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trades: tradeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
