import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  sidebarCollapsed: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    closeSidebar: (state) => {
      state.sidebarCollapsed = true;
    },
  },
});

export const { toggleSidebar, closeSidebar } = uiSlice.actions;
export default uiSlice.reducer;
