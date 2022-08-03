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
  },
});

export const { setCurrentPageData } = CurrentPageDataSlice.actions;

export default CurrentPageDataSlice.reducer;
