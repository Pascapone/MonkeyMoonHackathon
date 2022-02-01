import { useTheme } from "@mui/material";
import Grid from '@mui/material/Grid';

import floatingMonkeyImage from '../../assets/images/mm_w__float_helmet2.png'

import { Typography, Button, Box, Chip } from "@mui/material";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { motion } from 'framer-motion' 

import { toast } from 'react-toastify';

import { useSelector } from "react-redux";

import DashboardCard from "../Cards/DashboardCard";

import { copiedToClipboardEvent } from "../Shared/events";

import { ethers } from 'ethers'
import Moralis from 'moralis'


import cardImage2 from '../../assets/images/cyber1 min.jpg'
import cardImage1 from '../../assets/images/cyber2 min.jpg'
import cardImage3 from '../../assets/images/cyber3 min.jpg'
import { useEffect } from "react";
import { useMoralisCloudFunction } from "react-moralis";

import { getMonkeyMoon } from "../web3/web3MonkeyMoon";

import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';

import { loadUserNotifications } from "../database/database";
import { useMoralis } from 'react-moralis'

const cardText1 = `Join our community driven ecosystem. Learn more about the Monkey Moon project and it's goal to democratize the blockchain world.`
const cardTitle1 = 'Enter the Chain'
const cardDate1 = 'Jannuary 13, 2022'

const cardText2 = `Get ready for the monkey moon nft market place. We will have a unique like system, that will reward creators not only with royalties but also with passive income. The more`
const cardTitle2 = 'ICO About to Launch'
const cardDate2 = 'Jannuary 13, 2022'

const cardText3 = `Our ICO is about to launch! Link your telegram to your wallet to get white listed and join the monkey club. Find out more about the ecosystem and the upcoming ICO`
const cardTitle3 = 'Get Ready for the NFT\'s'
const cardDate3 = 'Jannuary 13, 2022'


const Home = () => {
  const theme = useTheme()

  const { fetch, data, error, isLoading, account } = useMoralisCloudFunction("Webhook", {});
  const { web3 } = useMoralis()

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

  const handleClick = () => {
    console.log("Fetch")
    fetch(onError, onComplete)
  }

  const onError = () => {
    console.log("Error")
  }

  const onComplete = (e) => {
    console.log("Complete")
    console.log(e)
  }
  
  
  const onClaim = async () => {
    console.log("Claim")
    const monkeyMoon = getMonkeyMoon()
    const monkeyMoonWithUser = monkeyMoon.connect(web3.getSigner())
    let cost = await monkeyMoonWithUser.getClaimCost()
    cost = ethers.BigNumber.isBigNumber(cost) ? cost.toNumber() : cost
    console.log(cost)
    monkeyMoonWithUser.claimMonkeyScore({value : cost.toString()})
  }
  
  const signTelegramLink = async () => {
    const user = Moralis.User.current()
    const telegramUserQuery = new Moralis.Query("telegramUser")
    telegramUserQuery.equalTo("ethAddress", user.get("ethAddress"))
    const telegramUser = await telegramUserQuery.first()

    const signMessageQuery = new Moralis.Query("signMessage")
    signMessageQuery.equalTo("telegramUser", telegramUser)
    const signMessage = await signMessageQuery.first()

    const signer = web3.getSigner()
    const signature = await signer.signMessage(signMessage.get('message'))
    console.log(signer)

    console.log(signature)

    const params =  { signature };    
    const result = await Moralis.Cloud.run("confirmTelegram", params);
    console.log(result)
  }

  const getNetworkId = async () => {
    
    console.log(web3)
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
              <Typography variant="h3" textAlign={'center'} style={{marginBottom : 10, marginTop : 0}}>
                Home
              </Typography>
              <Button variant="outlined" color="secondary" size='small' startIcon={<ContentCopyIcon />} onClick={handleTokenAddressClick}>
                Token Address
              </Button> 
            </Box>         
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} sx={{height : 0}}>          
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <DashboardCard text={cardText1} title={cardTitle1} date={cardDate1} image={cardImage1}/>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>  
            <DashboardCard text={cardText2} title={cardTitle3} date={cardDate2} image={cardImage2}/>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}> 
            <DashboardCard text={cardText3} title={cardTitle2} date={cardDate3} image={cardImage3}/>
          </Grid>  
        </Grid>
      </Box>
    </>
  )
}

export default Home;