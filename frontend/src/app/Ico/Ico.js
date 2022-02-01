import { Grid, Typography } from '@mui/material';
import { useTheme } from "@mui/material";

import floatingMonkeyImage from '../../assets/images/mm_w__float_helmet2.png'


import { Button, Box } from "@mui/material";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { motion } from 'framer-motion' 

import { toast } from 'react-toastify';

import NumberCard from "../Cards/NumberCard";
import StepCard from '../Cards/StepCard';
import TimerCard from '../Cards/TimerCard';
import TextCard from '../Cards/TextCard';
import MonkeyIcoCard from '../Cards/MonkeyIcoCard';
import MonkeyIcoCardMobile from '../Cards/MonkeyIcoCardMobile';

import { FaCoins } from "@react-icons/all-files/fa/FaCoins";
import { BsFillSafeFill } from "react-icons/bs";
import { BsCashCoin } from "react-icons/bs";
import { BsPeopleFill } from "react-icons/bs";
import { FaLayerGroup } from "@react-icons/all-files/fa/FaLayerGroup";
import { FaStopwatch } from "@react-icons/all-files/fa/FaStopwatch";
import { FaInfoCircle } from "@react-icons/all-files/fa/FaInfoCircle";

import { useSelector } from "react-redux";

import { loadIcoData } from '../web3/web3Ico';

import { useEffect, useMemo, useRef } from 'react';

import { setIcoOpen } from '../state/slices/icoSlice';

import { useDispatch } from 'react-redux';

import { copiedToClipboardEvent } from '../Shared/events';

import { useMoralis } from 'react-moralis';


const floatingMonkeyTransition = {
  type: "spring",
  damping: 10,
  stiffness: 100,
  repeat: Infinity, 
  duration: 4
}
const steps = [ {label : 'Baby Monkey', subtitle : '0.0001 AVAX'}, 
  {label : 'Young Monkey', subtitle : '0.00015 AVAX'},
  {label : 'Adult Monkey', subtitle : '0.0002 AVAX'}
];

const icoInfo = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`
const buyIcoText = "Buy some monkey moon today and be an early monkey."

const Ico = () => {
  const monkeyMoonAddress = useSelector(state => state.monkeyMoon.address)
  const contractDeployed = useSelector(state => state.monkeyMoon.contractDeployed)

  const { isAuthenticated, account, web3 } = useMoralis();

  const theme = useTheme()

  const dispatch = useDispatch()

  const investors  = useSelector(state => state.ico.investors)
  const rates  = useSelector(state => state.ico.rates)
  const timestamps  = useSelector(state => state.ico.timestamps)  
  const minBuyAmount  = useSelector(state => state.ico.minBuyAmount)
  const maxBuyAmount  = useSelector(state => state.ico.maxBuyAmount)
  const maxIcoAmount  = useSelector(state => state.ico.maxIcoAmount)
  const tokensLeft  = useSelector(state => state.ico.tokensLeft)
  const totalTokensInVault = useSelector(state => state.ico.totalTokensInVault)
  const weiRaisedOfUser = useSelector(state => state.ico.weiRaisedOfUser)
  const icoOpen = useSelector(state => state.ico.icoOpen)

  const timeout = useRef()

  const handleTokenAddressClick = () => {
    navigator.clipboard.writeText(monkeyMoonAddress)
    document.dispatchEvent(copiedToClipboardEvent)
  }

  const personalMaxBuyAmount = useMemo(() => {
    return maxBuyAmount - weiRaisedOfUser
  },[maxBuyAmount, weiRaisedOfUser])

  const currentStep = useMemo(() => {
    let step = 0
    const now = Date.now()

    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i];      
      if(now < timestamp) break
      step++
    }
    return step    
  }, [timestamps])

  const currentRate = useMemo(() => {
    if(!currentStep) return (1/rates[0]).toFixed(8)
    if(currentStep >= rates.length) return (1/rates[rates.length - 1]).toFixed(8)
    
    return (1/rates[currentStep - 1]).toFixed(8)
  }, [currentStep, rates]) 

  const startTimestamp = useMemo(() => {
    if(currentStep - 1 < 0){
      return Date.now()
    }
    return timestamps[currentStep - 1]
  }, [currentStep, timestamps])

  const endTimestamp = useMemo(() => {
    if(timestamps[currentStep]) return timestamps[currentStep]
    return timestamps[timestamps.length - 1]

  }, [currentStep, timestamps])

  useEffect(() => {    
    const now = Date.now()
    if(now < timestamps[0] || now > timestamps[timestamps.length - 1]){
      dispatch(setIcoOpen(false))
    }
    else{
      dispatch(setIcoOpen(true))
    }

  }, [currentStep, timestamps, dispatch])

  useEffect(() => {
    console.log(contractDeployed)
    console.log(web3)
    if(contractDeployed)
      loadIcoData(web3)
  }, [account, contractDeployed, web3])

  useEffect(() => {    
    return () => {
      clearTimeout(timeout.current)
    }
  }, [])

  const onCompleteStep = () => {  
    console.log("Complete Step")
    timeout.current = setTimeout(() => {
      // if(contractDeployed)
        // loadIcoData(web3)
      console.log(web3)
      clearTimeout(timeout.current)
    }, 5000) 
  }

  return(
    <>
      <Box sx={{width : '100%'}}>
        <Grid container spacing={2} rowSpacing={2}>        
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 140}}>
            <motion.div drag dragConstraints={{ left: -20, right: 20, top:-20, bottom: 20 }} className="topLayer" onClick={(e) => e.preventDefault()}>
              <motion.div initial={{y : 0}} transition={floatingMonkeyTransition} animate={{y : [0, -10, 0]}}>
                <img src={floatingMonkeyImage} alt="floating-monkey" onDragStart={(e) => e.preventDefault()} style={{margin : 'auto', display : 'block', marginTop : 20, width : 100}}/>
              </motion.div>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
              <Box style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection : 'column'}}>
              <Typography variant="h3" textAlign={'center'} style={{marginBottom : 10, marginTop : 0}}>
                Monkey ICO
              </Typography>
              <Button variant="outlined" color="secondary" size='small' startIcon={<ContentCopyIcon />} onClick={handleTokenAddressClick}>
                Token Address
              </Button> 
            </Box>         
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 0}}>          
          </Grid>
          {contractDeployed ? 
          <>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <NumberCard 
                title={"Tokens Distributed"} 
                subtitle={"Total tokens distributed"} 
                icon={<FaCoins style={{color : theme.palette.text.secondary, fontSize : 40}}/>}
                value={`${totalTokensInVault.toFixed(1)} MMC`}
                gain={totalTokensInVault.toFixed(1)}
                postfix={' MMC'}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <NumberCard 
                title={"Tokens Left"} 
                subtitle={"Total tokens left in to buy in the ICO"} 
                icon={<BsFillSafeFill style={{color : theme.palette.text.secondary, fontSize : 40}}/>}
                value={`${tokensLeft.toFixed(1)} MMC`}
                gain={-(totalTokensInVault/maxIcoAmount*10).toFixed(2)}
                postfix={'%'}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <NumberCard 
                title={"Current Token Price"} 
                subtitle={"The token price of the current ico step"} 
                icon={<BsCashCoin style={{color : theme.palette.text.secondary, fontSize : 40}}/>}
                value={`${currentRate} AVAX`}
                gain={(currentRate/(1/rates[0])*100-100).toFixed(2)}
                postfix={'%'}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <NumberCard 
                title={"Investors"} 
                subtitle={"Number of wallets particpating in the ico"} 
                icon={<BsPeopleFill style={{color : theme.palette.text.secondary, fontSize : 40}}/>}
                value={`${investors} Wallets`}
                gain={investors}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={8}>
              <StepCard 
                title={"ICO Phases"} 
                subtitle={"The ICO phases and prices"} 
                icon={<FaLayerGroup style={{color : theme.palette.text.secondary, fontSize : 40}}/>}
                steps={steps}
                activeStep={currentStep}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TimerCard 
                title={"ICO Progress"} 
                subtitle={"The progress of the current ico phase"} 
                icon={<FaStopwatch style={{color : theme.palette.text.secondary, fontSize : 40}}/>} 
                startTimestamp={startTimestamp}
                endTimestamp={endTimestamp}    
                onComplete={onCompleteStep}     
                running={icoOpen}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextCard 
                title={"ICO Info"} 
                subtitle={"Some info about the ico"} 
                text={icoInfo}
                icon={<FaInfoCircle style={{color : theme.palette.text.secondary, fontSize : 40}}/>}                  
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{position : 'relative'}}> 
              <MonkeyIcoCard 
                title={"Monkey Moon"} 
                subtitle={"Get some monkey moon"} 
                text={buyIcoText}
                icon={<FaInfoCircle style={{color : theme.palette.text.secondary, fontSize : 40}}/>}
                minValue={minBuyAmount}
                maxValue={personalMaxBuyAmount}
                price={currentRate}
                step={0.01}                  
              />   
              <MonkeyIcoCardMobile 
                title={"Monkey Moon"} 
                subtitle={"Get some monkey moon"} 
                text={buyIcoText}
                icon={<FaInfoCircle style={{color : theme.palette.text.secondary, fontSize : 40}}/>}
                minValue={minBuyAmount}
                maxValue={personalMaxBuyAmount}
                price={currentRate}
                step={0.01}                  
              />         
              {!icoOpen ?          
                <Box style={{position : 'absolute', top : 24, left : 32, bottom : 16, right : 16}}>
                  <div style={{position : 'absolute', top : 0, left : 0, bottom : 0, right : 0, backgroundColor : 'black', opacity : 0.5}}></div>
                  <Typography variant='h3' style={{position : 'absolute', top : "55%", left: "50%", transform: "translate(-50%, -50%)", opacity : 1, color : 'white', fontWeight : 1000}}>ICO Closed</Typography>            
                </Box>
                :
                (!isAuthenticated || !account ?         
                  <Box style={{position : 'absolute', top : 24, left : 32, bottom : 16, right : 16}}>
                    <div style={{position : 'absolute', top : 0, left : 0, bottom : 0, right : 0, backgroundColor : 'black', opacity : 0.5}}></div>
                    <Typography variant='h3' style={{position : 'absolute', top : "55%", left: "50%", transform: "translate(-50%, -50%)", opacity : 1, color : 'white', fontWeight : 1000}}>Please login</Typography>            
                  </Box>
                  :
                  <></>
                )
              }    
              
            </Grid>
          </> 
            :
            <Box sx={{textAlign : 'center', width : '100%'}}>
              <Typography variant='h5'>You are connected to the wrong network. Please use the Avalanche testnet chain.</Typography>
            </Box>
          }        
        </Grid>
      </Box>
    </>
  )
}

export default Ico;