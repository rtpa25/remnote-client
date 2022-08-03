import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../../interfaces/page.interface';

interface PagesDataState {
  pages: Page[];
}

// Define the initial state using that type
const initialState: PagesDataState = {
  pages: [],
};

export const PagesDataSlice = createSlice({
  name: 'pages',

  initialState: initialState,

  reducers: {
    setPages: (
      state: PagesDataState,
      action: PayloadAction<PagesDataState>
    ) => {
      state.pages = action.payload.pages;
    },
    addPage(state: PagesDataState, action: PayloadAction<{ page: Page }>) {
      state.pages.push(action.payload.page);
    },
  },
});

export const { setPages, addPage } = PagesDataSlice.actions;

export default PagesDataSlice.reducer;