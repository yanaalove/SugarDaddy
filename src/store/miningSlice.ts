import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { levels } from '../lib/levels'

interface MiningState {
  sessionActive: boolean
  timeLeft: number | null
  startTimeUTC: string | null
  balance: number
  userLevel: number
  sessionCompleted: boolean
  pointsToCollect: number
}

const initialState: MiningState = {
  sessionActive: false,
  timeLeft: null,
  startTimeUTC: null,
  balance: 0,
  userLevel: 0,
  sessionCompleted: false,
  pointsToCollect: 0,
}

export const miningSlice = createSlice({
  name: 'mining',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{ duration: number; startTime: string }>) => {
      state.sessionActive = true
      state.timeLeft = action.payload.duration
      state.startTimeUTC = action.payload.startTime
      state.sessionCompleted = false
      state.pointsToCollect = 0
    },
    updateTimeLeft: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload
      if (state.timeLeft <= 0) {
        state.sessionActive = false
        state.sessionCompleted = true
        const level = levels[state.userLevel]
        const totalMinutes = level.isDurationInHours ? level.duration * 60 : level.duration
        state.pointsToCollect = level.SugD * totalMinutes
      }
    },
    endSession: (state) => {
      state.sessionActive = false
      state.sessionCompleted = true
      state.timeLeft = null
      state.startTimeUTC = null
      const level = levels[state.userLevel]
      const totalMinutes = level.isDurationInHours ? level.duration * 60 : level.duration
      state.pointsToCollect = level.SugD * totalMinutes
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
    },
    setUserLevel: (state, action: PayloadAction<number>) => {
      state.userLevel = action.payload
    },
    collectPoints: (state) => {
      state.balance += state.pointsToCollect
      state.pointsToCollect = 0
      state.sessionCompleted = false
    },
    loadSessionFromStorage: (state, action: PayloadAction<MiningState>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { 
  startSession, 
  updateTimeLeft, 
  endSession, 
  updateBalance, 
  setUserLevel,
  collectPoints, 
  loadSessionFromStorage 
} = miningSlice.actions

export default miningSlice.reducer

