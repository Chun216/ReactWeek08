import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 讓全域可以共用這個取得書本的API
export const createAsyncGetBooks = createAsyncThunk(
  'getBooks/createAsyncGetBooks', async () => {
  try {
    const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
    return res.data.products
  } catch (error) {
    throw new Error(error.response?.data?.message || "取得產品失敗");
  } //finally {
  //   setIsScreenLoading(false);
    // }
});

const booksListSlice = createSlice({
  name: "booksList",
  initialState: {
    booksList: [],
    status: "idle", // idle / loading / succeeded / failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAsyncGetBooks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAsyncGetBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.booksList = action.payload;
      })
      .addCase(createAsyncGetBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default booksListSlice.reducer;