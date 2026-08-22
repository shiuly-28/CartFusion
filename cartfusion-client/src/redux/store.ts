
import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice"
import merchantSlice from "./merchantSlice"
export const store =  configureStore({
  reducer: {
    user: userSlice,
    merchant: merchantSlice
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch