import { styled } from '@mui/material/styles';
import { Paper } from "@mui/material";

export const Topbar = styled(Paper)(({ theme }) => {
  const light = theme.palette.mode === 'light'
  return {
    backgroundColor: light ? '#FFFFFF' : "#262430",    
    borderRadius : 0,      
    borderBottom : light ? '1px solid #d4d4d4' : 'none' ,
    zIndex : 100  
  }
});

export const SidebarStyled = styled(Paper)(({ theme }) => {
  const light = theme.palette.mode === 'light'
  return {
    backgroundColor: light ? '#FFFFFF' : "#262430",
    borderRadius : 0,   
    borderRight : light ? '1px solid #d4d4d4' : 'none',  
    marginTop : -2,
    zIndex : -1,
  }
});