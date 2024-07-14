import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    totalScore: 0,
  },
  reducers: {
    // updateTotalScore: (state, action) => {
    //   state.totalScore = action.payload;
    // },
  },
});

export const { updateTotalScore } = userSlice.actions;
export default userSlice.reducer;