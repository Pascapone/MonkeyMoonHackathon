import './navbar.css'
import monkeyHead from '../../assets/images/favicon.png'

import { useState} from "react";



import { Box } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SupportIcon from '@mui/icons-material/Support';
import HomeIcon from '@mui/icons-material/Home';

import SidebarItem from "./SidebarItem";


import { SidebarStyled } from '../styled/navbar'



const Sidebar = ({ navbarHeight }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return(
    <>
      <Box sx={{margin : 0, padding : 0}}>
        {/* <Box sx={{width : 100, height : 100, backgroundColor : 'GrayText'}}></Box> */}
        <SidebarStyled elevation={0} className="sidebar" style={{height : `calc(100vh - ${navbarHeight}px)`}}>   
          <SidebarItem materialIcon={<HomeIcon/>} route="/" category="Home" sidebarOpen={sidebarOpen}/> 
          <SidebarItem materialIcon={<DashboardIcon/>} route="/dashboard" category="Dashboard" sidebarOpen={sidebarOpen}/>                  
          <SidebarItem materialIcon={<ShoppingCartIcon/>} route="/ico" category="ICO" sidebarOpen={sidebarOpen}/>  
          <SidebarItem materialIcon={<SupportIcon/>} route="/vault" category="Vault" sidebarOpen={sidebarOpen}/> 
          {/* <SidebarItem materialIcon={<ColorLensIcon/>}  category="Color Palette" route="/color-palette" sidebarOpen={sidebarOpen}/>            */}
          <SidebarItem materialIcon={<ColorLensIcon/>} route="/nft" category="NFT" sidebarOpen={sidebarOpen}/>          
          <SidebarItem materialIcon={<SportsEsportsIcon/>} route="/games" category="Games" sidebarOpen={sidebarOpen}/>        
        </SidebarStyled>
      </Box>
    </>
  )
}

export default Sidebar