import { configureStore } from "@reduxjs/toolkit";
import booksListReducer from './slice/BooksListSlice';
import toastReducer from './slice/ToastSlice';

export const store = configureStore({
  reducer: {
    booksList: booksListReducer,
    toast: toastReducer,
  },
});