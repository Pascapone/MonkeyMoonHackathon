import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  investors : 0,
  currentRate : 0,
  rates : [],
  timestamps : [],
  tokensInVault : 0,
  totalTokensInVault : 0,
  tokensLeft : 0,
  minBuyAmount : 0,
  maxBuyAmount : 0,
  maxIcoAmount : 0,
  weiRaisedOfUser : 0,
  totalWeiRaised : 0,
  icoOpen : false,
  icoClosed : false,
}

const icoSlice = createSlice({
  name : 'ico',
  initialState,
  reducers : {
    setInvestors : (state, action) => {
      state.investors = action.payload
    },      
    setCurrentRate : (state, action) => {
      state.currentRate = action.payload
    },
    setRates : (state, action) => {
      state.rates = action.payload
    },
    setTimestamps : (state, action) => {
      state.timestamps = action.payload
    },
    setTokensInVault : (state, action) => {
      state.tokensInVault = action.payload
    },
    setTotalTokensInVault : (state, action) => {
      state.totalTokensInVault = action.payload
    },
    setTokensLeft : (state, action) => {
      state.tokensLeft = action.payload
    },
    setMinBuyAmount : (state, action) => {
      state.minBuyAmount = action.payload
    },
    setMaxBuyAmount : (state, action) => {
      state.maxBuyAmount = action.payload
    },   
    setMaxIcoAmount : (state, action) => {
      state.maxIcoAmount = action.payload
    }, 
    setWeiRaisedOfUser : (state, action) => {
      state.weiRaisedOfUser = action.payload
    },
    setTotalWeiRaised : (state, action) => {
      state.totalWeiRaised = action.payload
    },
    setIcoOpen : (state, action) => {
      state.icoOpen = action.payload
    },
    setIcoClosed : (state, action) => {
      state.icoClosed = action.payload
    }
  }
})

export const {
  setInvestors, 
  setCurrentRate, 
  setRates, 
  setTimestamps, 
  setTokensInVault, 
  setTotalTokensInVault,
  setTokensLeft,
  setMinBuyAmount,
  setMaxBuyAmount,
  setMaxIcoAmount,
  setWeiRaisedOfUser,
  setTotalWeiRaised,
  setIcoOpen,
  setIcoClosed,
} = icoSlice.actions
export default icoSlice.reducer