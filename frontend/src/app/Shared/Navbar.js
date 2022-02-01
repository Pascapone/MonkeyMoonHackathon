import './navbar.css'
import monkeyHead from '../../assets/images/favicon.png'

import { useRef, useEffect, useState, useCallback, useMemo } from "react";


import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar, toggleDarkMode } from "../state/slices/controllSlice";

import { Chip, IconButton, Box, Stack, Divider, Badge, chipClasses } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material";

import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { Topbar } from '../styled/navbar'
import AccountPopover from './AccountPopover';

import { getEllipsisTxt } from '../helpers/formatters';

import { copiedToClipboardEvent } from './events';

import { useMoralis } from "react-moralis";

import WalletsModal from "../WalletsModal/WalletsModal";

import NotificationDialog from '../Notifications/NotifcationDialog';

import { loadUserNotifications } from '../database/database';


import TelegramIcon from '@mui/icons-material/Telegram';

const chipSx = { 
    [`& .${chipClasses.label}`]: {
      marginTop : 0.22,
      fontWeight : 500,
      color : 'white'
    },
    [`& .${chipClasses.icon}`]: {
      color : 'white'
    }
  }


const Navbar = ({ notifications, setNotifications, handleClickHamburger }) => {
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false)
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false)
  const [mobile, setMobile] = useState(false)

  const topbarRef = useRef()
  const sidebarRef = useRef()
  const accountPopoverButtonRef = useRef()
  const accountPopoverMobileButtonRef = useRef()

  const darkMode = useSelector(state => state.controll.darkMode)
  const web3Account = useSelector(state => state.user.web3Account)  

  const dispatch = useDispatch()  

  const theme = useTheme()

  const { isAuthenticated, account, Moralis } = useMoralis();

  const [openWalletsModal, setOpenWalletsModal] = useState(false)

  const newNotifications = useMemo(() => {
    return notifications.reduce((prev, current) => {     
      if(!current.get("opened")){
        return prev + 1
      }
      else{
        return prev
      }
    }, 0)
  }, [notifications])

  const handleCloseAccountPopover = () => {
    setAccountPopoverOpen(false)
  }

  const handleAccountPopoverClick = () => {
    setAccountPopoverOpen(true)
  }
  
  const handleCopyWalletAddress = () => {    
    navigator.clipboard.writeText(web3Account)
    document.dispatchEvent(copiedToClipboardEvent)
  } 

  const handleDarkModeClick = () => {  
    localStorage.setItem("darkMode", !darkMode) 

    dispatch(toggleDarkMode())
  }

  const handleCloseModal = useCallback(() => {
    setOpenWalletsModal(false)
  }, [setOpenWalletsModal])

  const connectWallet = () => {
    setOpenWalletsModal(true)
  }

  const handleCloseNotificationDialog = () => {
    setOpenNotificationDialog(false)
  }

  const handleOpenNotificationDialog = async () => {
    const result = await loadUserNotifications(Moralis, account)
    setNotifications(result)
    setOpenNotificationDialog(true)
  }  

  const handleResize = async () => {
    if(window.innerWidth <= theme.breakpoints.values.sm){
      setMobile(true)
    }
    else{
      setMobile(false)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => {
      window.removeEventListener("resize", handleResize)
    };
  }, []);
  
  
  return(
    <>
      <AccountPopover 
        open={accountPopoverOpen} 
        handleClose={handleCloseAccountPopover} 
        anchorRef={mobile ? accountPopoverMobileButtonRef : accountPopoverButtonRef}
      />        
      <NotificationDialog
        open={openNotificationDialog}
        handleClose={handleCloseNotificationDialog}
        notifications={notifications}
        setNotifications={setNotifications}
      />  
      <WalletsModal open={openWalletsModal} handleClose={handleCloseModal}/> 
        <Box style={{width : '100%'}}>
          <Topbar elevation={0} className="topbar" ref={topbarRef}>
            <IconButton onClick={handleClickHamburger} sx={{display : {xs : 'none', sm : 'flex'}}}>
              <MenuIcon color={theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.grey[400]}/>
            </IconButton>
            <Stack style={{width : '100%'}} spacing={1} direction="row" justifyContent="flex-end" > 
              <IconButton className="right-menu-element" onClick={handleDarkModeClick}> 
                {darkMode ? <DarkModeIcon/>
                  :
                  <LightModeIcon/>
                }
              </IconButton> 
              <Divider orientation="vertical" flexItem />
              <Chip
                label='Telegram'
                style={{marginTop : 'auto', marginBottom : 'auto', backgroundColor : '#2AABED'}}
                icon={<TelegramIcon/>}
                clickable
                onClick={() => window.open(process.env.REACT_APP_PUBLIC_INVITE_LINK)}
                sx={{...chipSx, display : {xs : 'none', sm : 'flex'}}}   
              />
              <Chip
                style={{marginTop : 'auto', marginBottom : 'auto', backgroundColor : '#2AABED'}}
                icon={<TelegramIcon/>}
                clickable
                onClick={() => window.open(process.env.REACT_APP_PUBLIC_INVITE_LINK)}
                sx={{...chipSx, display : {xs : 'flex', sm : 'none'}}}   
              />
              <Divider orientation="vertical" flexItem />
              {isAuthenticated && account &&
              <>
                <IconButton>
                  <Badge badgeContent={0} color="success">
                    <EmailIcon/>  
                  </Badge>
                </IconButton>
                <Divider orientation="vertical" flexItem />
                <IconButton onClick={handleOpenNotificationDialog}>
                  <Badge badgeContent={newNotifications}  color="warning">
                    <NotificationsIcon/>
                  </Badge>  
                </IconButton>
                <Divider orientation="vertical" flexItem /> 
              </>
              }               
              <Chip
                label={isAuthenticated && account ? getEllipsisTxt(account.toLowerCase(), 5) : 'Connect'}
                style={{marginTop : 'auto', marginBottom : 'auto'}}
                color={isAuthenticated && account ? 'success' : 'error'}
                icon={<AccountBalanceWalletIcon/>}
                clickable
                onClick={!isAuthenticated || !account ? connectWallet : handleAccountPopoverClick}
                ref={accountPopoverButtonRef}
                sx={{...chipSx, display : {xs : 'none', sm : 'flex'}}}   
              />              
              <Chip
                style={{marginTop : 'auto', marginBottom : 'auto'}}
                color={isAuthenticated && account ? 'success' : 'error'}
                icon={<AccountBalanceWalletIcon/>}
                clickable
                onClick={!isAuthenticated || !account ? connectWallet : handleAccountPopoverClick}
                ref={accountPopoverMobileButtonRef}
                sx={{...chipSx, display : {xs : 'flex', sm : 'none'}}}              
              />              
            </Stack>            
          </Topbar> 
        </Box>  
    </>
  )
}

export default Navbar;