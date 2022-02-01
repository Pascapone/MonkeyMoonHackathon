import { createTheme } from "@mui/material/styles";
import { toggleDarkMode } from '../state/slices/controllSlice';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary : {
      main : '#6e5ce6',
      light : '#a095e6',
      dark : '#6450e6'
    },
    secondary:{
      main : '#d6c240',
      light : '#d6c86b',
      dark : '#d6ba00'
    },
    background:{
      paper : '#1A1825',
      default : '#1A1825',
    }
  },
  components: {
    MuiTypography : {
      styleOverrides : {
        root:{
          textOverflow : 'ellipsis'
        }
      }
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'special', size : 'small' },
          style: {
            textTransform: 'none',
            border: `2px solid #d5b907`,
            color : '#d5b907',
            fontSize : 12
          },
        },        
      ],
    },  
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary : {
      main : '#809BCE',
      light : '#a5b3cf',
      dark : '#3e71cf'
    },
    secondary:{
      main : '#037971',
      light : '#00998f',
      dark : '#004d47'
    } ,
    background: {
      paper: '#FFFFFF'
    },
    success:{
      main : '#47A025'
    },
    text : {
      primary : '#242424',
      secondary : '#575757'
    }   
  }, 
  typography: {
    body2: {
      fontWeight : 700,      
    }
  }, 
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'special', size: 'small' },
          style: {
            textTransform: 'none',
            border: `2px solid #b5446e`,
            color : '#b5446e',
            fontSize : 12
          },
        },        
      ],
    },
  },
});


export function handleInitialTheme (darkMode, dispatch) {
  let isDarkMode

  const storedMode = localStorage.getItem('darkMode')    

  if(storedMode != null){
    isDarkMode = storedMode === 'true';
  }
  else{
    // const mq = window.matchMedia('(prefers-color-scheme: dark)')
    // isDarkMode = mq.matches;
    isDarkMode = true
  }

  if(isDarkMode && !darkMode){
    dispatch(toggleDarkMode())
    localStorage.setItem("darkMode", true)
  }
  else if(!isDarkMode && darkMode){
    dispatch(toggleDarkMode())
    localStorage.setItem("darkMode", false)
  }    
}