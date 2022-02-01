import { useTheme } from "@mui/material";
import Grid from '@mui/material/Grid';

import floatingMonkeyImage from '../../assets/images/mm_w__float_helmet2.png'

import { Typography, Button, Box } from "@mui/material";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { motion } from 'framer-motion' 

import { toast } from 'react-toastify';

import { useSelector } from "react-redux";


import { Card, CardContent, CardActions } from "@mui/material";
import { CardHeader } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

import { claimTokens, loadIcoData } from "../web3/web3Ico";
import { getClaimScore } from '../database/database'

import { addMonkeyMoonToWallet } from "../web3/web3MonkeyMoon";

import { copiedToClipboardEvent } from "../Shared/events";

import { useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";

import { claimMonkeyScore } from '../web3/web3MonkeyMoon'


const Vault = () => {
  const tokensInVault  = useSelector(state => state.ico.tokensInVault)
  const icoTimestamp = useSelector(state => state.ico.timestamps)
  const monkeyMoonAddress = useSelector(state => state.monkeyMoon.address)
  const contractDeployed = useSelector(state => state.monkeyMoon.contractDeployed)

  const [claimClicked, setClaimClicked] = useState(false)
  const [addTokenLoading, setAddTokenLoading] = useState(false)
  const [claimScore, setClaimScore] = useState(0)

  const { isAuthenticated, account, web3, Moralis } = useMoralis();

  const theme = useTheme()

  const notifyTokensClaimed = () => toast.info("Your tokens have been successfully claimed", {
    theme: theme.palette.mode
  });

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

  const icoClosed = useMemo(() => {   
    return icoTimestamp[icoTimestamp.length - 1] > Date.now()
  }, [icoTimestamp])

  const onClaimConfirmation = async () => {
    await loadIcoData(web3)
    notifyTokensClaimed()    
    setClaimClicked(false)
  }

  const onClaimError = () => {
    setClaimClicked(false)
  }

  const handleClaimTokens = () => {    
    setClaimClicked(true)
    claimTokens(undefined, onClaimConfirmation, onClaimError, web3)
  }

  const handleClaimMonkeyScore = () => {
    console.log("Claim")
    claimMonkeyScore(web3)
  }

  const loadVaultData = async () => {
    await loadIcoData(web3)
    const score = await getClaimScore(Moralis)
    console.log(score)
    if(score){
      setClaimScore(score)
    }      
  }

  const handleAddTokenClick = () => {
    setAddTokenLoading(true)
    addMonkeyMoonToWallet(onTokenAdded, onTokenAddedError, onTokenAddedCanceled)
  }

  const onTokenAdded = () => {
    setAddTokenLoading(false)
  }

  const onTokenAddedError = (error) => {
    setAddTokenLoading(false)
  }

  const onTokenAddedCanceled = () => {
    setAddTokenLoading(false)
  }


  useEffect(() => {
    loadVaultData()
  }, [])

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
              <Typography variant="h3" textAlign={'center'} style={{marginBottom : 10, marginTop : 0}}>Vault</Typography>
              <Button variant="outlined" size='small' color="secondary" startIcon={<ContentCopyIcon />} onClick={handleTokenAddressClick}>
                Token Address
              </Button> 
            </Box>         
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 0}}>          
          </Grid>
          {isAuthenticated && account && contractDeployed ?
          <>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card sx={{margin : 2, borderRadius : 0}}>
                <CardHeader        
                  title={'ICO Vault'}
                  titleTypographyProps={{sx : {fontSize : 16}}}
                  subheaderTypographyProps={{sx : {fontSize : 14}}}
                  subheader={'Your MMC in the Vault'}
                />    
                <CardContent sx={{height : 100, marginTop : -1}}>
                  <Typography variant="body1" color="text.secondary">           
                    Claim your MMC as soon as the ICO is closed        
                  </Typography>                               
                
                  <Typography style={{marginTop : 20}} variant="h6">
                    {tokensInVault.toFixed(1)} MMC
                  </Typography>         
                </CardContent>
                <CardActions disableSpacing sx={{marginTop : 3}}>
                    <Box sx={{display : {xs : 'none', sm : 'block'}}}>
                      <LoadingButton loading={claimClicked} 
                        onClick={handleClaimTokens} 
                        variant='contained' 
                        size="small" 
                        disabled={icoClosed || tokensInVault === 0}
                      >
                        Claim MMC
                      </LoadingButton>                    
                      <LoadingButton sx={{marginLeft : 1}} loading={addTokenLoading} onClick={handleAddTokenClick} variant='contained' size="small">
                        Add Token to Wallet
                      </LoadingButton> 
                    </Box>   
                    <Box sx={{display : {xs : 'block', sm : 'none'}}}>
                      <Grid container rowSpacing={1}>
                        <Grid item xs={12}>
                          <LoadingButton loading={claimClicked} 
                            onClick={handleClaimTokens} 
                            variant='contained' 
                            size="small" 
                            disabled={icoClosed || tokensInVault === 0}
                          >
                            Claim MMC
                          </LoadingButton>     
                        </Grid>  
                        <Grid item xs={12}>             
                          <LoadingButton loading={addTokenLoading} onClick={handleAddTokenClick} variant='contained' size="small">
                            Add Token to Wallet
                          </LoadingButton> 
                        </Grid>
                      </Grid>
                    </Box>             
                </CardActions>          
              </Card> 
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card sx={{margin : 2, borderRadius : 0}}>
                <CardHeader        
                  title={'Monkey Score'}
                  titleTypographyProps={{sx : {fontSize : 16}}}
                  subheaderTypographyProps={{sx : {fontSize : 14}}}
                  subheader={'Your Monkey Score in the Vault'}                  
                />    
                <CardContent sx={{height : 100, marginTop : -1}}>
                  <Typography variant="body1" color="text.secondary">           
                    Claim your Monkey Score today        
                  </Typography>                              
                
                  <Typography style={{marginTop : 20}} variant="h6">
                    {claimScore} Score
                  </Typography>         
                </CardContent>
                <CardActions disableSpacing sx={{marginTop : 3}}>    
                <Button 
                  variant='contained' 
                  size="small" 
                  onClick={handleClaimMonkeyScore}
                >
                  Claim Monkey Score
                </Button>  
                </CardActions>          
              </Card> 
            </Grid>
          </>
          :
          <Box sx={{textAlign : 'center', width : '100%'}}>
            <Typography variant='h5'>{!contractDeployed ? "You are connected to the wrong network. Please use the Avalanche testnet chain." :"Please login to access your personal vault"}</Typography>
          </Box>
          }
          <Grid item xs={12} sm={12} md={6} lg={4}>  
            
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}> 
            
          </Grid>   
          <Grid item xs={12} sm={12} md={6} lg={4}> 
      
          </Grid>      
        </Grid>
      </Box>
    </>
  )
}

export default Vault;