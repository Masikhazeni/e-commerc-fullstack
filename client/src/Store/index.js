import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/AuthSlice';
import cartSliceReducer from './Slices/CartSlice'
import themeSlice from './Slices/ThemeSlice'

const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        cart :cartSliceReducer,
          theme:themeSlice
    }
})
export default store