// src/app/store.ts

import { configureStore } from '@reduxjs/toolkit';
// import partnersReducer from './features/partnersSlice';
import { partnersApi } from './features/partnersApi';

export const store = configureStore({
  reducer: {
    // partners: partnersReducer,
    [partnersApi.reducerPath]: partnersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(partnersApi.middleware),
});

// Inférer les types `RootState` et `AppDispatch` depuis le store lui-même
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
