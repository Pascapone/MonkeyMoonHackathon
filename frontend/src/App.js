import 'react-toastify/dist/ReactToastify.css';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './app/Shared/Navbar';

import { useDispatch, useSelector } from 'react-redux';

import {darkTheme, lightTheme, handleInitialTheme} from './app/theme/theme.js'

import { useEffect, useState, useRef, useCallback } from 'react'

import ToastManager from './app/Shared/ToastManager';

import { loadMonkeyMoon } from './app/web3/web3MonkeyMoon';
import { loadIco } from './app/web3/web3Ico';

import { useMoralis } from 'react-moralis';

import { loadUserNotifications } from './app/database/database';

import MobileNavigation from './app/Shared/MobileNavigation';

import { setContractDeployed } from './app/state/slices/monkeyMoonSlice'
import { loadMonkeyMoonNft } from './app/web3/web3Nft';
import { loadMonkeyMoonNftOffical } from './app/web3/web3NftOffical';

import { Box } from '@mui/material'

import Sidebar from './app/Shared/Sidebar'

import { Outlet } from "react-router-dom";
import { toggleSidebar } from "./app/state/slices/controllSlice";

import gsap from "gsap";

const defaultSidebarWidth = 200;

function App() {  
  const [notifications, setNotifications] = useState([])

  const darkMode = useSelector(state => state.controll.darkMode)
  const dispatch = useDispatch()  

  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading, logout, account, user, web3, Moralis } = useMoralis();

  const navbarRef = useRef()
  const bottomBarRef = useRef()
  const [navbarHeight, setNavbarHeight] = useState(0)
  const [bottomBarHeight, setBottomBarHeight] = useState(0)

  const [notificationSubscription, setNotificationSubscription] = useState()
  const [telegramUser, setTelegramUser] = useState()

  const sidebarOpen = useSelector(state => state.controll.sidebarOpen)

  let sidebarWidthDummy = {width : 0}
  const dummyRef = useRef(sidebarWidthDummy)
  const sidebarRef = useRef()

  const wrongNetworkEvent = new Event("connectedToWrongNetwork")

  const initiateWeb3 = async () => {
    window.ethereum.on('accountsChanged', accountChanged)
    window.ethereum.on('chainChanged', chainChanged)

    loadContracts()
  }

  const loadContracts = async () => {
    const connected = await loadMonkeyMoon(web3)

    if(!connected){
      document.dispatchEvent(wrongNetworkEvent)
      dispatch(setContractDeployed(false))
      return false
    }

    loadIco(web3)
    loadMonkeyMoonNft(web3)
    loadMonkeyMoonNftOffical(web3)
    dispatch(setContractDeployed(true))
    return true
  }

  const accountChanged = async () => {
    logout()
  }

  const chainChanged = async () => {
    loadContracts()
  }

  const getUserNotifications = async () => {

    const query = new Moralis.Query("telegramUser")
    query.equalTo("user", user)

    const tUser = await query.first()

    setTelegramUser(tUser)

    const notificationQuery = new Moralis.Query("notifications") 

    let subscription = await notificationQuery.subscribe();

    console.log("Subscripe")
    subscription.on('update', (object) => {
      if(object.get("user") === user || object.get("telegramUser") === telegramUser){
        console.log('Updated');
        console.log(object)
      }   
      console.log("Trigger")
      console.log(object)   
    })

    setNotificationSubscription(subscription)

    const result = await loadUserNotifications(Moralis, account)
    setNotifications(result)
  }

  useEffect(() => {
    if(isAuthenticated && isWeb3Enabled && user){ 
      console.log("HERE")
      getUserNotifications()
    }    
    return () => {
      if(notificationSubscription) notificationSubscription.unsubscribe()
    }
  },[isAuthenticated, isWeb3Enabled, user])  

  useEffect(() => {
    if(isWeb3Enabled){
      initiateWeb3()   
    }
  }, [isWeb3Enabled]);
  
  const handleResize = () => {
    setNavbarHeight(navbarRef.current.clientHeight)
    setBottomBarHeight(bottomBarRef.current.clientHeight)
  }

  useEffect(() => {
    setNavbarHeight(navbarRef.current.clientHeight)
  }, [navbarRef.current]);
  
  useEffect(() => {
    setBottomBarHeight(bottomBarRef.current.clientHeight)
  }, [bottomBarRef.current]);

  useEffect(() => {    
    const connectorId = window.localStorage.getItem("connectorId");
    if(connectorId){
      enableWeb3({ provider: connectorId })   
      
    }    
    handleInitialTheme(darkMode, dispatch) // Only dark mode for now

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }

  }, [])

  const handleClickHamburger = () => {
    if(sidebarOpen){
      CloseSidebar()
    }
    else{
      OpenSidebar()
    }
  }

  const OpenSidebar = () => {
    dummyRef.current.width = 45

    gsap.to(dummyRef.current, {duration : 0.1, 
      width : defaultSidebarWidth, 
      onUpdate : updateTween, 
      onComplete : completeTweenOpenSidebar
    })
  }

  const updateTween = useCallback(() => { 
    sidebarRef.current.style.flex = `0 0 ${sidebarWidthDummy.width}px`    
  }, [sidebarWidthDummy.width])

  const CloseSidebar = useCallback(() => {
    dummyRef.current.width = 200

    dispatch(toggleSidebar())

    gsap.to(dummyRef.current, {duration : 0.1, width : 45, onUpdate : updateTween})

  }, [dispatch, updateTween])  

  const completeTweenOpenSidebar = () => dispatch(toggleSidebar())

  

  return ( 
    <>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>  
        <CssBaseline enableColorScheme />  
        <ToastManager/> 
        <Box sx={{height : '100%'}}>          
          <Box ref={navbarRef}>
            <Navbar 
              notifications={notifications} 
              setNotifications={setNotifications}
              handleClickHamburger={handleClickHamburger}              
            /> 
          </Box>     
          <Box sx={{display : 'flex', width : '100%'}}>
            <Box sx={{
              width : 200, flexShrink : 0, 
              display : {xs : 'none', sm : 'block'},
              overflow : 'hidden',              
            }}
              ref={sidebarRef}
            >        
              <Sidebar navbarHeight={navbarHeight}/>  
            </Box>
            <Box sx={{
              width : '100%',
              height : `calc(100vh - ${navbarHeight + bottomBarHeight}px)`, 
              display: "flex",
              overflowY : "scroll",
              padding : 2,
              direction : 'column'
            }}
            >            
              <Outlet/> 
            </Box>
          </Box> 
          <Box ref={bottomBarRef} sx={{width : '100%', height : {xs : 58, sm : 0}, display : {xs : 'flex', sm : 'none'}, direction : 'row'}}>
            <MobileNavigation/>
          </Box>
        </Box>   
      </ThemeProvider>
    </>
  );
}

export default App;
