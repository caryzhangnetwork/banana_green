import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './redux/menuSlice';
import userReducer from './redux/userSlice';


const store = configureStore({
  reducer: {
    menu: menuReducer,
    user: userReducer,
  },
});

export default store;