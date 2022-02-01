import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address : null,
  contractDeployed : false,
}

const monkeyMoonSlice = createSlice({
  name : 'monkeyMoon',
  initialState,
  reducers : {
    setMonkeyMoonAddress : (state, action) => {
      state.address = action.payload
    },
    setContractDeployed : (state, action) => {
      state.contractDeployed = action.payload
    }
  }
})

export const { setMonkeyMoonAddress, setContractDeployed } = monkeyMoonSlice.actions

export default monkeyMoonSlice.reducer