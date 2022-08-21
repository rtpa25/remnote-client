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
    updatePage(state: PagesDataState, action: PayloadAction<{ page: Page }>) {
      const index = state.pages.findIndex(
        (page) => page._id === action.payload.page._id
      );
      if (index !== -1) {
        state.pages[index] = action.payload.page;
      }
    },
    deletePage(state: PagesDataState, action: PayloadAction<{ page: Page }>) {
      const index = state.pages.findIndex(
        (page) => page._id === action.payload.page._id
      );
      if (index !== -1) {
        state.pages.splice(index, 1);
      }
    },
  },
});

export const { setPages, addPage, updatePage, deletePage } =
  PagesDataSlice.actions;

export default PagesDataSlice.reducer;
