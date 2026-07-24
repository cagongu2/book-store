import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/ui-slice';
import authReducer from './slices/auth-slice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        auth: authReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
