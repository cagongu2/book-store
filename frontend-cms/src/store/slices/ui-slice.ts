import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
}

const initialState: UiState = {
    theme: 'light',
    sidebarCollapsed: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.sidebarCollapsed = action.payload;
        },
    },
});

export const { toggleTheme, toggleSidebar, setSidebarCollapsed } = uiSlice.actions;

export default uiSlice.reducer;
