import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen : true,
  activeSidebarItem: 'Dashboard',
  activeSidebarSubItem: null,  
  darkMode : false,
}

const controllSlice = createSlice({
    name: 'controll',
    initialState,
    reducers: {
      toggleSidebar(state){
        state.sidebarOpen = !state.sidebarOpen
      },
      setActiveSidebarItem(state, action){
        state.activeSidebarItem = action.payload
      },
      setActiveSidebarSubItem(state, action){
        state.activeSidebarSubItem = action.payload
      },
      toggleDarkMode(state){
        state.darkMode = !state.darkMode
      },    
    }
  }
)

export const { toggleSidebar, setActiveSidebarItem, setActiveSidebarSubItem, toggleDarkMode } = controllSlice.actions
export default controllSlice.reducer