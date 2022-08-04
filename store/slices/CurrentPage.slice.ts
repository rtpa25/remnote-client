import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../../interfaces/page.interface';

interface CurrentPageDataState {
  page: Page | undefined;
}

// Define the initial state using that type
const initialState: CurrentPageDataState = {
  page: undefined,
};

export const CurrentPageDataSlice = createSlice({
  name: 'currentPage',

  initialState: initialState,

  reducers: {
    setCurrentPageData: (
      state: CurrentPageDataState,
      action: PayloadAction<CurrentPageDataState>
    ) => {
      state.page = action.payload.page;
    },
    updateCurrentPageData: (
      state: CurrentPageDataState,
      action: PayloadAction<{ name: string; body: string }>
    ) => {
      if (state.page) {
        state.page.name = action.payload.name;
        state.page.body = action.payload.body;
      }
    },
  },
});

export const { setCurrentPageData, updateCurrentPageData } =
  CurrentPageDataSlice.actions;

export default CurrentPageDataSlice.reducer;
