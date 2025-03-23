import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    messages: [],
  },
  reducers: {
    pushMessage (state, action) {
      const { text, status } = action.payload;
      const id = Date.now();
      state.messages.push({
        id,
        text,
        status,
      })
    },
    removeMessage (state, action) {
      // 透過payload找到訊息的id，找到對應上的再看是第幾筆，接著就可以予以刪除
      const message_id = action.payload;
      const index = state.messages.findIndex((message) => message.id === message_id);
      // 找不到index會等於-1，所以找到了就不等於-1
      if (index !== -1) {
        state.messages.splice(index, 1)
      } 
    }
  },
})

export const { pushMessage, removeMessage } = toastSlice.actions;

export default toastSlice.reducer