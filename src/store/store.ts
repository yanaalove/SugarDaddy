import { configureStore } from '@reduxjs/toolkit'
import miningReducer from './miningSlice'

export const store = configureStore({
  reducer: {
    mining: miningReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

