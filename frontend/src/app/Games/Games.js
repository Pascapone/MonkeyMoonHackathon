import { useTheme } from "@mui/material";
import Grid from '@mui/material/Grid';

import floatingMonkeyImage from '../../assets/images/mm_w__float_helmet2.png'

import { Typography, Button, Box, Tab, Tabs, styled } from "@mui/material";
import { tabsClasses } from '@mui/material/Tabs';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { motion } from 'framer-motion' 

import { useSelector } from "react-redux";

import { useMoralis } from "react-moralis";

import { copiedToClipboardEvent } from "../Shared/events";

import { useEffect, useState } from 'react'

import NftItemCard from "../Cards/NftItemCard";
import {v4 as uuid} from 'uuid'

import { getBatchBalance } from "../web3/web3Nft";

const Games = () => {
  const contractDeployed = useSelector(state => state.monkeyMoon.contractDeployed)

  const { web3, Moralis, isInitialized, isWeb3Enabled } = useMoralis();

  const theme = useTheme()

  const monkeyMoonAddress = useSelector(state => state.monkeyMoon.address)  

  const handleTokenAddressClick = () => {
    navigator.clipboard.writeText(monkeyMoonAddress)
    document.dispatchEvent(copiedToClipboardEvent)
  }
  
  const floatingMonkeyTransition = {
    type: "spring",
    damping: 10,
    stiffness: 100,
    repeat: Infinity, 
    duration: 4
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
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 120}}>
              <Box style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection : 'column'}}>
              <Typography variant="h3" textAlign={'center'} style={{marginBottom : 10, marginTop : 0}}>Games</Typography>
              <Button variant="outlined" color="secondary" size='small' startIcon={<ContentCopyIcon />} onClick={handleTokenAddressClick}>
                Token Address
              </Button> 
            </Box>         
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 0}}>          
          </Grid>     
          <Grid item xs={12} sm={12} md={12} lg={12}>   
            <Typography textAlign={'center'} variant="h4">Coming soon...</Typography>       
          </Grid>  
        </Grid>      
      </Box>      
    </>
  )
}

export default Games;