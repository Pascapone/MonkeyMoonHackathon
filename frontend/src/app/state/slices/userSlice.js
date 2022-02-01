import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  web3Account : null,
  accessToken : null,
  notifications : [],
}
const userSlice = createSlice({
  name : 'user',
  initialState,
  reducers : {
    setWeb3Account : (state, action) => {
      state.web3Account = action.payload;
    },
    setAccessToken : (state, action) => {
      state.accessToken = action.payload
    },
    setNotifications : (state, action) => {
      state.notifications = action.payload
    },
  }
})

export const { setWeb3Account, setAccessToken, setNotifications } = userSlice.actions
export default userSlice.reducer