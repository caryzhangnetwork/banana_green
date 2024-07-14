import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './redux/menuSlice';

const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
});

export default store;