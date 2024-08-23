import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    updateQuote: 0,
  },
  reducers: {
    updateQuote: (state, action) => {
      state.quote = action.payload;
    },
  },
});

export const { updateQuote } = userSlice.actions;
export default userSlice.reducer;