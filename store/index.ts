import { configureStore } from '@reduxjs/toolkit';
import currentUserReducers from './slices/CurrentUser.slice';
import currentPageReducers from './slices/CurrentPage.slice';
import pagesReducers from './slices/Pages.slice';

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducers,
    pages: pagesReducers,
    currentPage: currentPageReducers,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
