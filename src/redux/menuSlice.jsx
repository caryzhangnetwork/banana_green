import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    profileIndex: 0,
  },
  reducers: {
    updateProfileIndex: (state, action) => {
      state.profileIndex = action.payload;
    },
  },
});

export const { updateProfileIndex } = menuSlice.actions;
export default menuSlice.reducer;