import { configureStore } from '@reduxjs/toolkit'
import controllReducer from './slices/controllSlice'
import userReducer from './slices/userSlice'
import icoReducer from './slices/icoSlice'
import monkeyMoonReducer from './slices/monkeyMoonSlice'

export const store = configureStore({
  reducer: {
    controll: controllReducer,
    user : userReducer,
    ico : icoReducer,
    monkeyMoon : monkeyMoonReducer,
  },
})