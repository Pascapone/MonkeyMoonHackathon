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
import { getBatchBalanceOffical } from "../web3/web3NftOffical";
import CreateNFT from "./CreateNFT";


const TabContainer = ({ children, value, index }) => {
  const StyledDiv = styled('div')({
    visibility : index === value ? 'visible' : 'hidden'
  });
  
  if(index === value){
    return(
      <Grid container spacing={2} rowSpacing={2} sx={{marginLeft : 1, marginRight : 1, marginTop: 1}} component={StyledDiv}>      
        {children}   
      </Grid>
    )
  }
  else{
    return null
  }
  
}

const MyNFTs = ({ allNfts, userBalances, userBalancesOffical }) => { 
  console.log(allNfts)
  console.log(userBalances)
  if(allNfts.length){
    return (
      <>
        {allNfts.reduce((filtered, nft, index) => { 
          if(nft.get("offical")){
            if(userBalancesOffical[nft.get("tokenId")] > 0){            
              filtered.push(
                <Grid key={uuid()} item xs={12} sm={12} md={6} lg={3}>
                  <NftItemCard text={nft.get("description")} nftObject={nft}/>
                </Grid>  
              )            
            }  
          }
          else{
            if(userBalances[nft.get("tokenId")] > 0){    
              console.log("Has balance")        
              filtered.push(
                <Grid key={uuid()} item xs={12} sm={12} md={6} lg={3}>
                  <NftItemCard text={nft.get("description")} nftObject={nft}/>
                </Grid>  
              )            
            }  
          }
          
          return filtered        
        }, [])} 
      </>
    )
  }
  else{
    return (
      <></>
    )
  } 
}

const OfficalNFTs = ({ allNfts, userBalances, userBalancesOffical }) => { 
  console.log(allNfts)
  if(allNfts.length){
    return (
      <>
        {allNfts.reduce((filtered, nft, index) => { 
          if(nft.get("offical")){                  
            filtered.push(
              <Grid key={uuid()} item xs={12} sm={12} md={6} lg={3}>
                <NftItemCard text={nft.get("description")} nftObject={nft}/>
              </Grid>  
            )  
          }          
          return filtered        
        }, [])} 
      </>
    )
  }
  else{
    return (
      <></>
    )
  } 
}

const UserNFTs = ({ allNfts, userBalances, userBalancesOffical }) => { 
  
  if(allNfts.length){
    return (
      <>
        {allNfts.reduce((filtered, nft, index) => { 
          if(!nft.get("offical")){           
            filtered.push(
              <Grid key={uuid()} item xs={12} sm={12} md={6} lg={3}>
                <NftItemCard text={nft.get("description")} nftObject={nft}/>
              </Grid>  
            )      
          }         
          
          return filtered        
        }, [])} 
      </>
    )
  }
  else{
    return (
      <></>
    )
  } 
}

const NFT = () => {
  const contractDeployed = useSelector(state => state.monkeyMoon.contractDeployed)

  const { isAuthenticated, account, web3, Moralis, isInitialized, isWeb3Enabled } = useMoralis();

  const [allNfts, setAllNfts] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [userBalances, setUserBalances] = useState([])
  const [userBalancesOffical, setUserBalancesOffical] = useState([])

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

  const handleChangeTab = async (event, newValue) => {
    switch (newValue) {
      case 0:
        await loadAllNFTs()
        break;
      case 1:
        await loadAllNFTs()
        break;
      case 2:
        await loadAllNFTs()
        break;
      case 3:
        await loadAllNFTs()
        break;
      default:
        break;
    }
    
    console.log("Trigger")
    setTabValue(newValue)
  }

  const loadAllNFTs = async () => {
    const nftQuery = new Moralis.Query("MonkeyMoonNFT")
    const nfts = await nftQuery.find()  
    setAllNfts(nfts)
    const balances = await getBatchBalance(web3)
    const balancesOffical = await getBatchBalanceOffical(web3)
    setUserBalances(balances)
    setUserBalancesOffical(balancesOffical)
  }

  useEffect(() => {
    if(isInitialized && isWeb3Enabled){
      loadAllNFTs();
    }
  }, [isInitialized, isWeb3Enabled]);
  

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
              <Typography variant="h3" textAlign={'center'} style={{marginBottom : 10, marginTop : 0}}>NFT</Typography>
              <Button variant="outlined" color="secondary" size='small' startIcon={<ContentCopyIcon />} onClick={handleTokenAddressClick}>
                Token Address
              </Button> 
            </Box>         
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 0}}>          
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>  
            <Box sx={{flexGrow: 1, maxWidth: "100%", display : {xs : 'none', sm : 'none', md : 'block'}}}>
              <Tabs centered value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab label="All NFT's" />
                <Tab label="Offical NFT'S" />
                <Tab label="User NFT's" />
                <Tab label="My NFT's" />
                <Tab label="Create NFT" />
              </Tabs>
            </Box>
            <Box sx={{flexGrow: 1, maxWidth: "100%", display : {sm : 'block', md : 'none'}}}>
              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons
                aria-label="visible arrows tabs example"
                sx={{
                  [`& .${tabsClasses.scrollButtons}`]: {
                    '&.Mui-disabled': { opacity: 0.3 },
                    display : {xs : 'flex'}
                  },
                }}
              >
                <Tab label="All NFT's" />
                <Tab label="Offical NFT'S" />
                <Tab label="User NFT's" />
                <Tab label="My NFT's" />
                <Tab label="Create NFT" />
              </Tabs>
            </Box>
          </Grid>
          <TabContainer value={tabValue} index={0}>
            {allNfts.map((nft) => (
              <Grid key={uuid()} item xs={12} sm={12} md={6} lg={3}>
                <NftItemCard 
                  nftObject={nft}                  
                />
              </Grid>  
            ))}             
          </TabContainer>     
          <TabContainer value={tabValue} index={1}>
            <OfficalNFTs allNfts={allNfts} userBalances={userBalances} userBalancesOffical={userBalancesOffical}/>
          </TabContainer>
          <TabContainer value={tabValue} index={2}>
            <UserNFTs allNfts={allNfts} userBalances={userBalances} userBalancesOffical={userBalancesOffical}/>
          </TabContainer>
          <TabContainer value={tabValue} index={3}>
            <MyNFTs allNfts={allNfts} userBalances={userBalances} userBalancesOffical={userBalancesOffical}/>
          </TabContainer> 
          <TabContainer value={tabValue} index={4}>
            <CreateNFT/>
          </TabContainer> 
        </Grid>  
        <Box style={{height : 20, width : '100%'}}></Box>
      </Box>
      
    </>
  )
}

export default NFT;